import { Type } from 'class-transformer';
import { IsEnum, IsUUID, ValidateNested } from 'class-validator';
import { QuestCategory } from '../../quests/entities/quest-template.entity';
import { OnboardingBaselineDto } from './onboarding-baseline.dto';

export class SwapTemplateDto {
  @IsEnum(QuestCategory)
  category: QuestCategory;

  @IsUUID()
  excludeTemplateId: string;

  @ValidateNested()
  @Type(() => OnboardingBaselineDto)
  baseline: OnboardingBaselineDto;
}
