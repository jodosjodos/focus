import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement, AchievementType } from './entities/achievement.entity';
import { AchievementUnlock } from './entities/achievement-unlock.entity';
import { Quest } from '../quests/entities/quest.entity';
import { QuestTemplate } from '../quests/entities/quest-template.entity';
import { Program } from '../programs/entities/program.entity';
import { AchievementsService } from './achievements.service';
import {
  HIDDEN_ACHIEVEMENT_RULES,
  HiddenAchievementContext,
  HiddenAchievementTrigger,
} from './hidden-achievement-rules';

@Injectable()
export class HiddenAchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementsRepository: Repository<Achievement>,
    @InjectRepository(AchievementUnlock)
    private readonly unlocksRepository: Repository<AchievementUnlock>,
    @InjectRepository(Quest)
    private readonly questsRepository: Repository<Quest>,
    @InjectRepository(QuestTemplate)
    private readonly templatesRepository: Repository<QuestTemplate>,
    @InjectRepository(Program)
    private readonly programsRepository: Repository<Program>,
    private readonly achievementsService: AchievementsService,
  ) {}

  async evaluate(
    trigger: HiddenAchievementTrigger,
    ctx: HiddenAchievementContext,
  ): Promise<void> {
    const rules = HIDDEN_ACHIEVEMENT_RULES.filter((r) => r.trigger === trigger);
    if (rules.length === 0) {
      return;
    }

    const alreadyUnlocked = await this.getUnlockedHiddenKeysForUser(ctx.userId);
    const repos = {
      quests: this.questsRepository,
      templates: this.templatesRepository,
      programs: this.programsRepository,
    };

    for (const rule of rules) {
      if (alreadyUnlocked.has(rule.key)) {
        continue;
      }
      const shouldUnlock = await rule.evaluate(ctx, repos);
      if (!shouldUnlock) {
        continue;
      }
      const achievement = await this.achievementsRepository.findOne({
        where: { hiddenRuleKey: rule.key },
      });
      if (!achievement) {
        // Seed-content gap — don't let it break quest-completion.
        continue;
      }
      await this.achievementsService.unlock({
        userId: ctx.userId,
        achievementId: achievement.id,
        programId: ctx.programId,
        dayNumberAtUnlock: ctx.dayNumber,
      });
    }
  }

  private async getUnlockedHiddenKeysForUser(userId: string): Promise<Set<string>> {
    const rows: { hiddenRuleKey: string }[] = await this.unlocksRepository.manager.query(
      `SELECT a."hiddenRuleKey" FROM achievement_unlocks au
       JOIN achievements a ON a.id = au."achievementId"
       WHERE au."userId" = $1 AND a.type = $2`,
      [userId, AchievementType.HIDDEN],
    );
    return new Set(rows.map((r) => r.hiddenRuleKey));
  }
}
