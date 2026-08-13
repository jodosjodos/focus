import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoLink } from './entities/video-link.entity';
import { VideoCompletion } from './entities/video-completion.entity';
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

export interface VideoLibraryItem extends VideoLink {
  assigned: boolean;
  completed: boolean;
}

@Injectable()
export class VideoQuestsService {
  constructor(
    @InjectRepository(VideoLink)
    private readonly videoLinksRepository: Repository<VideoLink>,
    @InjectRepository(VideoCompletion)
    private readonly completionsRepository: Repository<VideoCompletion>,
    @InjectRepository(Quest)
    private readonly questsRepository: Repository<Quest>,
    @InjectRepository(Program)
    private readonly programsRepository: Repository<Program>,
    private readonly questCompletionService: QuestCompletionService,
  ) {}

  async findByIdOrThrow(id: string): Promise<VideoLink> {
    const link = await this.videoLinksRepository.findOne({ where: { id } });
    if (!link) {
      throw new NotFoundException('VideoLink not found');
    }
    return link;
  }

  async listWithStatus(userId: string, programId?: string): Promise<VideoLibraryItem[]> {
    const links = await this.videoLinksRepository.find();
    const completions = await this.completionsRepository.find({ where: { userId } });
    const completedIds = new Set(completions.map((c) => c.videoLinkId));
    const assignedIds = new Set(await this.assignedContentIds(userId, programId));

    return links.map((link) => ({
      ...link,
      assigned: assignedIds.has(link.id),
      completed: completedIds.has(link.id),
    }));
  }

  /** Idempotently records the video as watched for this user, then awards XP
   * via the existing QuestCompletionService if it matches today's pending
   * assigned quest — otherwise just marks it watched with no XP. */
  async completeEntry(
    videoLinkId: string,
    userId: string,
    programId?: string,
  ): Promise<{ entry: VideoLink; xpAwarded: number }> {
    const entry = await this.findByIdOrThrow(videoLinkId);
    await this.recordCompletion(userId, videoLinkId);

    const pendingQuest = await this.findPendingAssignedQuest(userId, programId, videoLinkId);
    if (!pendingQuest) {
      return { entry, xpAwarded: 0 };
    }

    const completed = await this.questCompletionService.complete(pendingQuest.id);
    return { entry, xpAwarded: completed.xpAwarded };
  }

  private async recordCompletion(userId: string, videoLinkId: string): Promise<void> {
    const existing = await this.completionsRepository.findOne({
      where: { userId, videoLinkId },
    });
    if (existing) {
      return;
    }
    try {
      await this.completionsRepository.save(
        this.completionsRepository.create({ userId, videoLinkId }),
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
        questTemplate: { questType: QuestType.VIDEO },
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
    videoLinkId: string,
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
        questTemplate: { questType: QuestType.VIDEO, sourceContentId: videoLinkId },
      },
    });
  }
}
