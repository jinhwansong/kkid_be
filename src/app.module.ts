import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthVerificationService } from './auth-verification/auth-verification.service';
import { CommentModule } from './comment/comment.module';
import * as Entities from './entities';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { MuxService } from './mux/mux.service';
import { RedisModule } from './redis/redis.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    // dotenv 전역사용
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
      // 마이그레이션
      migrations: [join(__dirname, './migrations/**/*{.ts,.js}')],
      migrationsRun: process.env.NODE_ENV === 'production' ? false : true,
      migrationsTableName: 'migrations',
      // 연결유지
      autoLoadEntities: true,
      retryAttempts: 3,
      retryDelay: 3000,
      // 직접 만들고 db에 만들때 처음에 만들때만 true로
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      extra: {
        max: 20, // 최대 연결 수
        connectionTimeoutMillis: 60000, // 연결 시도 제한 시간 (ms)
        idleTimeoutMillis: 30000, // 유휴 연결 타임아웃 (ms)
      },
    }),
    TypeOrmModule.forFeature(Object.values(Entities)),
    VideoModule,
    CommentModule,
    RedisModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthVerificationService, MuxService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
