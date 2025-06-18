import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthVerificationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async verifyTokenAndGetUser(token: string) {
    const backUrl = this.configService.get<string>('SPRING_VERIFY_API');
    try {
      const { data } = await firstValueFrom(this.httpService.get(backUrl,{
        headers: {Authorization: `Bearer ${token.trim()}`}
      }));
      return data
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag('method', 'verifyTokenAndGetUser');
        scope.setExtra('token', token);
        scope.setContext('인증 실패', {
          이유: 'Spring 서버에서 토큰 인증 실패ㅠㅠ',
          URL: backUrl,
        });
        Sentry.captureException(error);
      });
      throw new UnauthorizedException('인증되지 않은 사용자');
    }
  }
}
