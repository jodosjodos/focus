import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingEntry } from './entities/reading-entry.entity';
import { ReadingCompletion } from './entities/reading-completion.entity';
import { Quest, QuestStatus } from '../quests/entities/quest.entity';
import { QuestType } from '../quests/entities/quest-template.entity';
import { Program } from '../programs/entities/program.entity';
import { QuestCompletionService } from '../quests/quest-completion.service';

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === '23505'
  );
}

export interface ReadingLibraryItem extends ReadingEntry {
  assigned: boolean;
  completed: boolean;
}

@Injectable()
export class ReadingService {
  constructor(
    @InjectRepository(ReadingEntry)
    private readonly readingRepository: Repository<ReadingEntry>,
    @InjectRepository(ReadingCompletion)
    private readonly completionsRepository: Repository<ReadingCompletion>,
    @InjectRepository(Quest)
    private readonly questsRepository: Repository<Quest>,
    @InjectRepository(Program)
    private readonly programsRepository: Repository<Program>,
    private readonly questCompletionService: QuestCompletionService,
  ) {}

  async findByIdOrThrow(id: string): Promise<ReadingEntry> {
    const entry = await this.readingRepository.findOne({ where: { id } });
    if (!entry) {
      throw new NotFoundException('ReadingEntry not found');
    }
    return entry;
  }

  async listWithStatus(userId: string, programId?: string): Promise<ReadingLibraryItem[]> {
    const entries = await this.readingRepository.find();
    const completions = await this.completionsRepository.find({ where: { userId } });
    const completedIds = new Set(completions.map((c) => c.readingEntryId));
    const assignedIds = new Set(await this.assignedContentIds(userId, programId));

    return entries.map((entry) => ({
      ...entry,
      assigned: assignedIds.has(entry.id),
      completed: completedIds.has(entry.id),
    }));
  }

  /** Idempotently records the entry as read for this user, then awards XP via
   * the existing QuestCompletionService if it matches today's pending assigned
   * quest — otherwise just marks it read with no XP (browsing ahead). */
  async completeEntry(
    entryId: string,
    userId: string,
    programId?: string,
  ): Promise<{ entry: ReadingEntry; xpAwarded: number }> {
    const entry = await this.findByIdOrThrow(entryId);
    await this.recordCompletion(userId, entryId);

    const pendingQuest = await this.findPendingAssignedQuest(userId, programId, entryId);
    if (!pendingQuest) {
      return { entry, xpAwarded: 0 };
    }

    const completed = await this.questCompletionService.complete(pendingQuest.id);
    return { entry, xpAwarded: completed.xpAwarded };
  }

  private async recordCompletion(userId: string, readingEntryId: string): Promise<void> {
    const existing = await this.completionsRepository.findOne({
      where: { userId, readingEntryId },
    });
    if (existing) {
      return;
    }
    try {
      await this.completionsRepository.save(
        this.completionsRepository.create({ userId, readingEntryId }),
      );
    } catch (error) {
      if (!isUniqueViolation(error)) {
        throw error;
      }
    }
  }

  private async assignedContentIds(userId: string, programId?: string): Promise<string[]> {
    if (!programId) {
      return [];
    }
    const program = await this.programsRepository.findOne({ where: { id: programId } });
    if (!program || program.userId !== userId) {
      return [];
    }
    const pendingQuests = await this.questsRepository.find({
      where: {
        programId,
        dayNumber: program.currentDay,
        status: QuestStatus.PENDING,
        questTemplate: { questType: QuestType.READING },
      },
      relations: { questTemplate: true },
    });
    return pendingQuests
      .map((q) => q.questTemplate.sourceContentId)
      .filter((id): id is string => !!id);
  }

  private async findPendingAssignedQuest(
    userId: string,
    programId: string | undefined,
    entryId: string,
  ): Promise<Quest | null> {
    if (!programId) {
      return null;
    }
    const program = await this.programsRepository.findOne({ where: { id: programId } });
    if (!program || program.userId !== userId) {
      return null;
    }
    return this.questsRepository.findOne({
      where: {
        programId,
        dayNumber: program.currentDay,
        status: QuestStatus.PENDING,
        questTemplate: { questType: QuestType.READING, sourceContentId: entryId },
      },
    });
  }
}
