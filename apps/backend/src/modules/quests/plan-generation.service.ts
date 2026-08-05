import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  QuestTemplate,
  QuestCategory,
  QuestDifficulty,
  QuestType,
  ScalingRule,
} from './entities/quest-template.entity';
import {
  ImprovementArea,
  OnboardingBaseline,
  ExerciseFrequencyTier,
  ScreenTimeHoursTier,
  WaterLitersTier,
  SleepHoursTier,
} from '../programs/entities/program.entity';
import { XP_BY_DIFFICULTY } from './xp.constants';

export interface GeneratedQuest {
  templateId: string;
  title: string;
  description: string;
  questType: QuestType;
  primaryStat: QuestCategory;
  secondaryStat: QuestCategory | null;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  baseXp: number;
  target: string | null;
  isMainQuest: boolean;
  isBonusQuest: boolean;
}

// project-description §5.3 Step 1 — area → category, ordered by preference so
// Step 2's "avoid duplicate categories" rule has a deterministic fallback.
// Exported — WeeklyQuestService reuses it to derive the top-weighted area's
// category.
export const AREA_CATEGORY_MAP: Record<ImprovementArea, QuestCategory[]> = {
  [ImprovementArea.SLEEP]: [QuestCategory.DISCIPLINE],
  [ImprovementArea.BODY]: [QuestCategory.STRENGTH],
  [ImprovementArea.FOCUS]: [QuestCategory.FOCUS],
  [ImprovementArea.DISCIPLINE]: [QuestCategory.DISCIPLINE],
  [ImprovementArea.CONFIDENCE]: [QuestCategory.CONFIDENCE],
  [ImprovementArea.MIND]: [QuestCategory.WISDOM],
  [ImprovementArea.WEALTH]: [QuestCategory.DISCIPLINE, QuestCategory.WISDOM],
  [ImprovementArea.RELATIONSHIPS]: [QuestCategory.CONFIDENCE],
  [ImprovementArea.CAREER]: [QuestCategory.WISDOM, QuestCategory.DISCIPLINE],
  [ImprovementArea.HABITS]: [QuestCategory.DISCIPLINE],
};

// Step 3 anchors — screen-time target = anchor - 1.5h, floored at 1h.
// Validated against the doc's own example: SIX_PLUS(6) - 1.5 = 4.5h.
const SCREEN_TIME_ANCHOR: Record<ScreenTimeHoursTier, number> = {
  [ScreenTimeHoursTier.UNDER_2]: 1.5,
  [ScreenTimeHoursTier.TWO_TO_FOUR]: 3,
  [ScreenTimeHoursTier.FOUR_TO_SIX]: 5,
  [ScreenTimeHoursTier.SIX_PLUS]: 6,
};

const WATER_TARGET: Record<WaterLitersTier, string> = {
  [WaterLitersTier.UNDER_1L]: '2L',
  [WaterLitersTier.ONE_TO_TWO_L]: '2.5L',
  [WaterLitersTier.TWO_TO_THREE_L]: '3L',
  [WaterLitersTier.THREE_PLUS_L]: '3L',
};

const WORKOUT_DIFFICULTY: Record<ExerciseFrequencyTier, QuestDifficulty> = {
  [ExerciseFrequencyTier.NEVER]: QuestDifficulty.EASY,
  [ExerciseFrequencyTier.ONE_TO_TWO]: QuestDifficulty.MEDIUM,
  [ExerciseFrequencyTier.THREE_PLUS]: QuestDifficulty.HARD,
};

const SLEEP_NEEDS_SHIFT = new Set([
  SleepHoursTier.UNDER_5,
  SleepHoursTier.FIVE_TO_SIX,
]);

@Injectable()
export class PlanGenerationService {
  constructor(
    @InjectRepository(QuestTemplate)
    private readonly templatesRepository: Repository<QuestTemplate>,
  ) {}

  /** Rotated so a different area leads (and becomes Main Quest) each day. */
  private rotateAreas(
    improvementAreas: ImprovementArea[],
    dayNumber: number,
  ): ImprovementArea[] {
    const offset = (dayNumber - 1) % improvementAreas.length;
    return [
      ...improvementAreas.slice(offset),
      ...improvementAreas.slice(0, offset),
    ];
  }

  applyBaselineScaling(
    template: QuestTemplate,
    baseline: OnboardingBaseline,
  ): { difficulty: QuestDifficulty; baseXp: number; target: string | null } {
    let difficulty = template.difficulty;
    let target = template.defaultTarget;

    switch (template.scalingRule) {
      case ScalingRule.WATER:
        target = WATER_TARGET[baseline.waterLiters];
        break;
      case ScalingRule.WORKOUT:
        difficulty = WORKOUT_DIFFICULTY[baseline.exerciseFrequency];
        break;
      case ScalingRule.SCREEN_TIME: {
        const hours = Math.max(
          1,
          SCREEN_TIME_ANCHOR[baseline.screenTimeHours] - 1.5,
        );
        target = `under ${hours}h`;
        break;
      }
      case ScalingRule.SLEEP:
        if (SLEEP_NEEDS_SHIFT.has(baseline.sleepHours)) {
          target = 'shift bedtime 30 min earlier this week';
        }
        break;
      default:
        break;
    }

    return { difficulty, baseXp: XP_BY_DIFFICULTY[difficulty], target };
  }

  async generateDay(params: {
    improvementAreas: ImprovementArea[];
    baseline: OnboardingBaseline;
    programLength: number;
    dayNumber: number;
  }): Promise<GeneratedQuest[]> {
    const { improvementAreas, baseline, programLength, dayNumber } = params;

    const maxPerDay = programLength <= 30 ? 4 : 5;
    const questCount = Math.min(improvementAreas.length, maxPerDay);
    const rotated = this.rotateAreas(improvementAreas, dayNumber);
    const areasForToday = rotated.slice(0, questCount);

    const allTemplates = await this.templatesRepository.find();
    const usedCategories = new Set<QuestCategory>();
    const usedTypes = new Set<QuestType>();
    const generated: GeneratedQuest[] = [];

    for (const area of areasForToday) {
      const candidateCategories = AREA_CATEGORY_MAP[area];
      const category =
        candidateCategories.find((c) => !usedCategories.has(c)) ??
        candidateCategories[0];

      const inCategory = allTemplates.filter((t) => t.category === category);
      const template =
        inCategory.find((t) => !usedTypes.has(t.questType)) ?? inCategory[0];

      if (!template) {
        // No seed template for this category — skip rather than crash;
        // shouldn't happen once seed data covers all 5 categories.
        continue;
      }

      usedCategories.add(category);
      usedTypes.add(template.questType);

      const scaled = this.applyBaselineScaling(template, baseline);

      generated.push({
        templateId: template.id,
        title: template.title,
        description: template.description,
        questType: template.questType,
        primaryStat: template.primaryStat,
        secondaryStat: template.secondaryStat,
        category: template.category,
        difficulty: scaled.difficulty,
        baseXp: scaled.baseXp,
        target: scaled.target,
        isMainQuest: area === rotated[0],
        isBonusQuest: false,
      });
    }

    const usedTemplateIds = new Set(generated.map((g) => g.templateId));
    this.appendBonusQuest(generated, allTemplates, baseline, usedTemplateIds, usedTypes);

    return generated;
  }

  /** project-description §5.3 Step 5 — one extra quest, one difficulty tier
   * harder than today's own average, worth 1.5x XP, no penalty if skipped.
   * Mutates `generated` in place by pushing the bonus quest if one is found. */
  private appendBonusQuest(
    generated: GeneratedQuest[],
    allTemplates: QuestTemplate[],
    baseline: OnboardingBaseline,
    usedTemplateIds: Set<string>,
    usedTypes: Set<QuestType>,
  ): void {
    if (generated.length === 0) {
      return;
    }

    const DIFFICULTY_RANK: Record<QuestDifficulty, number> = {
      [QuestDifficulty.EASY]: 1,
      [QuestDifficulty.MEDIUM]: 2,
      [QuestDifficulty.HARD]: 3,
    };
    const RANK_DIFFICULTY = [QuestDifficulty.EASY, QuestDifficulty.MEDIUM, QuestDifficulty.HARD];

    const avgRank =
      generated.reduce((sum, g) => sum + DIFFICULTY_RANK[g.difficulty], 0) / generated.length;
    const avgDifficulty = RANK_DIFFICULTY[Math.min(2, Math.round(avgRank) - 1)];
    const bonusDifficulty = RANK_DIFFICULTY[Math.min(2, DIFFICULTY_RANK[avgDifficulty])];

    const bonusCategory =
      generated.find((g) => g.isMainQuest)?.category ?? generated[0].category;

    const bonusCandidates = allTemplates.filter(
      (t) =>
        t.category === bonusCategory &&
        t.difficulty === bonusDifficulty &&
        !usedTemplateIds.has(t.id),
    );
    const bonusTemplate =
      bonusCandidates.find((t) => !usedTypes.has(t.questType)) ?? bonusCandidates[0];

    if (!bonusTemplate) {
      // No template available one tier harder in today's leading category —
      // no bonus quest today rather than breaking the "matches your focus
      // area" feel with a cross-category fallback.
      return;
    }

    // Deliberately NOT running the bonus template through the full
    // applyBaselineScaling() difficulty branch — its WORKOUT rule would
    // silently override the tier-up we just computed. Only its target text
    // (water/screen-time/sleep) is worth reusing.
    const scaledTarget = this.applyBaselineScaling(bonusTemplate, baseline).target;

    generated.push({
      templateId: bonusTemplate.id,
      title: bonusTemplate.title,
      description: bonusTemplate.description,
      questType: bonusTemplate.questType,
      primaryStat: bonusTemplate.primaryStat,
      secondaryStat: bonusTemplate.secondaryStat,
      category: bonusTemplate.category,
      difficulty: bonusDifficulty,
      baseXp: Math.round(XP_BY_DIFFICULTY[bonusDifficulty] * 1.5),
      target: scaledTarget,
      isMainQuest: false,
      isBonusQuest: true,
    });
  }

  async getTemplateOrThrow(id: string): Promise<QuestTemplate> {
    return this.templatesRepository.findOneOrFail({ where: { id } });
  }

  async findAlternateTemplate(
    category: QuestCategory,
    excludeTemplateId: string,
  ): Promise<QuestTemplate | null> {
    const inCategory = await this.templatesRepository.find({
      where: { category },
    });
    return inCategory.find((t) => t.id !== excludeTemplateId) ?? null;
  }
}
