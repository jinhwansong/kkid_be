import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@/redis/redis.module';
import { JammitPersistenceModule } from '@/database/jammit-persistence.module';
import { JammitAuthController } from './jammit-auth.controller';
import { JammitAuthService } from './jammit-auth.service';
import { JammitEmailCodeService } from './jammit-email-code.service';
import { JammitJwtService } from './jammit-jwt.service';
import { JammitMailService } from './jammit-mail.service';
import { AuthVerificationService } from './auth-verification.service';

@Module({
  imports: [
    JammitPersistenceModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY') ?? 'dev-secret-change-me',
      }),
    }),
    RedisModule,
    HttpModule,
  ],
  controllers: [JammitAuthController],
  providers: [
    JammitJwtService,
    JammitAuthService,
    JammitEmailCodeService,
    JammitMailService,
    AuthVerificationService,
  ],
  exports: [JammitJwtService, AuthVerificationService],
})
export class JammitAuthModule {}
