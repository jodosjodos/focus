import 'dotenv/config';
import { DataSource } from 'typeorm';
import { typeOrmEntities, typeOrmMigrationsGlob } from './typeorm.config';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: typeOrmEntities,
  migrations: typeOrmMigrationsGlob,
  synchronize: false,
});
