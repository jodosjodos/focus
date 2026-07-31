import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuestCompletionService } from './quest-completion.service';
import { CompleteQuestDto } from './dto/complete-quest.dto';

@UseGuards(JwtAuthGuard)
@Controller('quests')
export class QuestCompletionController {
  constructor(private readonly questCompletionService: QuestCompletionService) {}

  @Post(':id/complete')
  complete(@Param('id') id: string, @Body() dto: CompleteQuestDto) {
    return this.questCompletionService.complete(id, dto.loggedValue);
  }

  @Post(':id/skip')
  skip(@Param('id') id: string) {
    return this.questCompletionService.skip(id);
  }
}
