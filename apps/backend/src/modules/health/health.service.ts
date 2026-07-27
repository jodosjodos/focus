import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async check() {
    const [{ now }] = (await this.dataSource.query(
      'SELECT NOW() as now',
    )) as { now: Date }[];

    return {
      status: 'ok' as const,
      db: 'connected' as const,
      dbTime: now,
    };
  }
}
