import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum QuestType {
  CHECKBOX = 'checkbox',
  QUANTITY = 'quantity',
  DURATION = 'duration',
  READING = 'reading',
  VIDEO = 'video',
  WORKOUT = 'workout',
}

export enum QuestDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum QuestCategory {
  STRENGTH = 'Strength',
  DISCIPLINE = 'Discipline',
  FOCUS = 'Focus',
  WISDOM = 'Wisdom',
  CONFIDENCE = 'Confidence',
  CUSTOM = 'Custom',
}

// Marks the specific seed templates that project-description §5.3 Step 3
// scales numerically from onboarding baseline answers. Only one template per
// rule should carry it (e.g. the single canonical "Drink Water" template).
export enum ScalingRule {
  WATER = 'water',
  WORKOUT = 'workout',
  SCREEN_TIME = 'screen_time',
  SLEEP = 'sleep',
}

@Entity('quest_templates')
export class QuestTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: QuestType })
  questType: QuestType;

  @Column({ type: 'enum', enum: QuestCategory })
  primaryStat: QuestCategory;

  @Column({ type: 'enum', enum: QuestCategory, nullable: true })
  secondaryStat: QuestCategory | null;

  @Column({ type: 'enum', enum: QuestDifficulty })
  difficulty: QuestDifficulty;

  @Column({ type: 'int' })
  baseXp: number;

  @Column({ type: 'enum', enum: QuestCategory })
  category: QuestCategory;

  @Column({ type: 'varchar', nullable: true })
  defaultTarget: string | null;

  @Column({ type: 'varchar', nullable: true })
  sourceContentId: string | null;

  @Column({ type: 'enum', enum: ScalingRule, nullable: true })
  scalingRule: ScalingRule | null;
}
