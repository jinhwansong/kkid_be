import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
      throw new UnauthorizedException('인증되지 않은 사용자');
    }
  }
}
