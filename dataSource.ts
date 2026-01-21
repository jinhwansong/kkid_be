import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { join } from 'path';
import * as Entities from './src/entities';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: Object.values(Entities).map((entity) => entity),
  migrations: [join(__dirname, 'src/migrations/**/*{.ts,.js}')],
  migrationsRun: process.env.NODE_ENV === 'production' ? false : true,
  migrationsTableName: 'migrations',
  // 직접 만들고 db에 만들때 처음에 만들때만 true로
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.NODE_ENV === 'production' ? false : true,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  extra: {
    max: 20, // 최대 연결 수
    connectionTimeoutMillis: 60000, // 연결 시도 제한 시간 (ms)
    idleTimeoutMillis: 30000, // 유휴 연결 타임아웃 (ms)
  },
});

export default dataSource;
