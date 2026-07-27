import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { typeOrmEntities, typeOrmMigrationsGlob } from './database/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { QuestsModule } from './modules/quests/quests.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        url: configService.get<string>('database.url'),
        entities: typeOrmEntities,
        migrations: typeOrmMigrationsGlob,
        synchronize: false,
      }),
    }),
    AuthModule,
    UsersModule,
    ProgramsModule,
    QuestsModule,
    HealthModule,
  ],
})
export class AppModule {}
