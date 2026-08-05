import { Repository } from 'typeorm';
import { Quest } from '../quests/entities/quest.entity';
import { QuestTemplate, QuestCategory, QuestType } from '../quests/entities/quest-template.entity';
import { Program } from '../programs/entities/program.entity';

export type HiddenAchievementTrigger =
  | 'quest_completed'
  | 'day_resolved'
  | 'quest_skipped'
  | 'quest_restored';

export interface HiddenAchievementContext {
  userId: string;
  programId: string;
  dayNumber: number;
  questId?: string;
}

export interface HiddenAchievementRepos {
  quests: Repository<Quest>;
  templates: Repository<QuestTemplate>;
  programs: Repository<Program>;
}

export interface HiddenAchievementRule {
  key: string;
  trigger: HiddenAchievementTrigger;
  evaluate(
    ctx: HiddenAchievementContext,
    repos: HiddenAchievementRepos,
  ): Promise<boolean>;
}

const REAL_STAT_CATEGORIES = [
  QuestCategory.STRENGTH,
  QuestCategory.DISCIPLINE,
  QuestCategory.FOCUS,
  QuestCategory.WISDOM,
  QuestCategory.CONFIDENCE,
];

const ALL_QUEST_TYPES = Object.values(QuestType);

export const HIDDEN_ACHIEVEMENT_RULES: HiddenAchievementRule[] = [
  {
    key: 'hidden_early_bird',
    trigger: 'day_resolved',
    // Every quest completed on a given program-day was completed before
    // 8:00 AM local, across 3 separate days (any of the user's programs).
    async evaluate(ctx, repos) {
      const rows: { cnt: string }[] = await repos.quests.manager.query(
        `SELECT COUNT(*) AS cnt FROM (
           SELECT q."programId", q."dayNumber"
           FROM quests q
           JOIN programs p ON p.id = q."programId"
           WHERE p."userId" = $1 AND q.status = 'complete'
           GROUP BY q."programId", q."dayNumber"
           HAVING BOOL_AND(EXTRACT(HOUR FROM (q."completedAt" AT TIME ZONE p.timezone)) < 8)
         ) sub`,
        [ctx.userId],
      );
      return Number(rows[0]?.cnt ?? 0) >= 3;
    },
  },
  {
    key: 'hidden_perfect_week',
    trigger: 'day_resolved',
    // 7 consecutive program days (same program) with zero skipped quests.
    async evaluate(ctx, repos) {
      if (ctx.dayNumber < 7) return false;
      const rows: { cnt: string }[] = await repos.quests.manager.query(
        `SELECT COUNT(*) AS cnt FROM quests
         WHERE "programId" = $1 AND "dayNumber" BETWEEN $2 AND $3
           AND "isBonusQuest" = false AND status = 'skipped'`,
        [ctx.programId, ctx.dayNumber - 6, ctx.dayNumber],
      );
      return Number(rows[0]?.cnt ?? 0) === 0;
    },
  },
  {
    key: 'hidden_comeback',
    trigger: 'quest_completed',
    // A quest that was restored from skipped reaches complete, 3 times.
    async evaluate(ctx, repos) {
      const rows: { cnt: string }[] = await repos.quests.manager.query(
        `SELECT COUNT(*) AS cnt FROM quests q
         JOIN programs p ON p.id = q."programId"
         WHERE p."userId" = $1 AND q."wasRestored" = true AND q.status = 'complete'`,
        [ctx.userId],
      );
      return Number(rows[0]?.cnt ?? 0) >= 3;
    },
  },
  {
    key: 'hidden_night_owl',
    trigger: 'quest_completed',
    // Completed a quest after 11:00 PM local, 5 times.
    async evaluate(ctx, repos) {
      const rows: { cnt: string }[] = await repos.quests.manager.query(
        `SELECT COUNT(*) AS cnt FROM quests q
         JOIN programs p ON p.id = q."programId"
         WHERE p."userId" = $1 AND q.status = 'complete'
           AND EXTRACT(HOUR FROM (q."completedAt" AT TIME ZONE p.timezone)) >= 23`,
        [ctx.userId],
      );
      return Number(rows[0]?.cnt ?? 0) >= 5;
    },
  },
  {
    key: 'hidden_jack_of_all',
    trigger: 'day_resolved',
    // One day's completed quests cover all 5 real stats.
    async evaluate(ctx, repos) {
      const rows: { primaryStat: QuestCategory }[] = await repos.quests.manager.query(
        `SELECT DISTINCT qt."primaryStat" FROM quests q
         JOIN quest_templates qt ON qt.id = q."questTemplateId"
         WHERE q."programId" = $1 AND q."dayNumber" = $2 AND q.status = 'complete'`,
        [ctx.programId, ctx.dayNumber],
      );
      const covered = new Set(rows.map((r) => r.primaryStat));
      return REAL_STAT_CATEGORIES.every((c) => covered.has(c));
    },
  },
  {
    key: 'hidden_no_days_off',
    trigger: 'day_resolved',
    async evaluate(ctx, repos) {
      const program = await repos.programs.findOne({ where: { id: ctx.programId } });
      return (program?.streakCount ?? 0) >= 30;
    },
  },
  {
    key: 'hidden_renaissance',
    trigger: 'quest_completed',
    // Completed at least one quest of every questType, ever.
    async evaluate(ctx, repos) {
      const rows: { questType: QuestType }[] = await repos.quests.manager.query(
        `SELECT DISTINCT qt."questType" FROM quests q
         JOIN quest_templates qt ON qt.id = q."questTemplateId"
         JOIN programs p ON p.id = q."programId"
         WHERE p."userId" = $1 AND q.status = 'complete'`,
        [ctx.userId],
      );
      const covered = new Set(rows.map((r) => r.questType));
      return ALL_QUEST_TYPES.every((t) => covered.has(t));
    },
  },
  {
    key: 'hidden_bounce_back',
    trigger: 'day_resolved',
    // A day with at least one skipped quest but zero still-pending, 3 times.
    async evaluate(ctx, repos) {
      const rows: { cnt: string }[] = await repos.quests.manager.query(
        `SELECT COUNT(*) AS cnt FROM (
           SELECT q."programId", q."dayNumber"
           FROM quests q
           JOIN programs p ON p.id = q."programId"
           WHERE p."userId" = $1
           GROUP BY q."programId", q."dayNumber"
           HAVING COUNT(*) FILTER (WHERE q.status = 'skipped') >= 1
              AND COUNT(*) FILTER (WHERE q.status = 'pending') = 0
         ) sub`,
        [ctx.userId],
      );
      return Number(rows[0]?.cnt ?? 0) >= 3;
    },
  },
];
