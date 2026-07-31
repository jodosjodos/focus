import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoLink } from './entities/video-link.entity';

@Injectable()
export class VideoQuestsService {
  constructor(
    @InjectRepository(VideoLink)
    private readonly videoLinksRepository: Repository<VideoLink>,
  ) {}

  async findByIdOrThrow(id: string): Promise<VideoLink> {
    const link = await this.videoLinksRepository.findOne({ where: { id } });
    if (!link) {
      throw new NotFoundException('VideoLink not found');
    }
    return link;
  }
}
