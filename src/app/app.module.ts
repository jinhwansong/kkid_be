import { JammitPersistenceModule } from '@/database/jammit-persistence.module';
import { JammitAuthModule } from '@/jammit-auth/jammit-auth.module';
import { JammitGatheringsModule } from '@/jammit-gathering/jammit-gatherings.module';
import { JammitReviewModule } from '@/jammit-review/jammit-review.module';
import { JammitUserModule } from '@/jammit-user/jammit-user.module';
import { HttpModule } from '@nestjs/axios';
import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { CommentModule } from '../comment/comment.module';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';
import { ALL_ENTITIES } from '../database/entities';
import { RedisModule } from '../redis/redis.module';
import { VideoModule } from '../video/video.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      logging: process.env.NODE_ENV === 'production' ? false : true,
      migrations: [join(__dirname, '../database/migrations/**/*{.ts,.js}')],
      migrationsRun: process.env.NODE_ENV === 'production' ? false : true,
      migrationsTableName: 'migrations',
      autoLoadEntities: true,
      retryAttempts: 3,
      retryDelay: 3000,
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      extra: {
        max: 20,
        connectionTimeoutMillis: 60000,
        idleTimeoutMillis: 30000,
      },
    }),
    TypeOrmModule.forFeature(ALL_ENTITIES),
    ScheduleModule.forRoot(),
    JammitPersistenceModule,
    JammitAuthModule,
    JammitUserModule,
    JammitGatheringsModule,
    JammitReviewModule,
    VideoModule,
    CommentModule,
    RedisModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [JammitPersistenceModule, JammitAuthModule],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
