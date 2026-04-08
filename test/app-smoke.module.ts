import { Module } from '@nestjs/common';
import { AppController } from '../src/app/app.controller';
import { AppService } from '../src/app/app.service';

/** DB·Redis 없이 루트 라우트만 검증할 때 사용 */
@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppSmokeModule {}
