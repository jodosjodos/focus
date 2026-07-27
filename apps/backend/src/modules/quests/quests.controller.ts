import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuestsService } from './quests.service';
import { CreateQuestTemplateDto } from './dto/create-quest-template.dto';

@UseGuards(JwtAuthGuard)
@Controller('quest-templates')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Post()
  create(@Body() dto: CreateQuestTemplateDto) {
    return this.questsService.createTemplate(dto);
  }

  @Get()
  findAll() {
    return this.questsService.findAllTemplates();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questsService.findTemplateByIdOrThrow(id);
  }
}
