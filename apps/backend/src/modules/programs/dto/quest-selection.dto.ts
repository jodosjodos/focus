import { IsBoolean, IsUUID } from 'class-validator';

export class QuestSelectionDto {
  @IsUUID()
  templateId: string;

  @IsBoolean()
  isMainQuest: boolean;
}
