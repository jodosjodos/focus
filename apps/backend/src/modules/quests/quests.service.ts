import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestTemplate } from './entities/quest-template.entity';
import { CreateQuestTemplateDto } from './dto/create-quest-template.dto';

@Injectable()
export class QuestsService {
  constructor(
    @InjectRepository(QuestTemplate)
    private readonly questTemplatesRepository: Repository<QuestTemplate>,
  ) {}

  createTemplate(dto: CreateQuestTemplateDto): Promise<QuestTemplate> {
    const template = this.questTemplatesRepository.create({
      ...dto,
      secondaryStat: dto.secondaryStat ?? null,
      defaultTarget: dto.defaultTarget ?? null,
      sourceContentId: null,
    });
    return this.questTemplatesRepository.save(template);
  }

  findAllTemplates(): Promise<QuestTemplate[]> {
    return this.questTemplatesRepository.find();
  }

  async findTemplateByIdOrThrow(id: string): Promise<QuestTemplate> {
    const template = await this.questTemplatesRepository.findOne({
      where: { id },
    });
    if (!template) {
      throw new NotFoundException('QuestTemplate not found');
    }
    return template;
  }
}
