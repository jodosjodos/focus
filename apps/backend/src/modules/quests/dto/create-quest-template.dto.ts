import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import {
  QuestCategory,
  QuestDifficulty,
  QuestType,
} from '../entities/quest-template.entity';

export class CreateQuestTemplateDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(QuestType)
  questType: QuestType;

  @IsEnum(QuestCategory)
  primaryStat: QuestCategory;

  @IsOptional()
  @IsEnum(QuestCategory)
  secondaryStat?: QuestCategory;

  @IsEnum(QuestDifficulty)
  difficulty: QuestDifficulty;

  @IsInt()
  baseXp: number;

  @IsEnum(QuestCategory)
  category: QuestCategory;

  @IsOptional()
  @IsString()
  defaultTarget?: string;
}
