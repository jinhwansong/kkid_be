import { CommonResponseDto } from '@/common/dto/api-response.dto';
import { Injectable } from '@nestjs/common';
import { RedisService } from '@/redis/redis.service';

export type EmailVerifyCodeHttpResult = {
  statusCode: number;
  body: CommonResponseDto<{ success: boolean; message: string }>;
};

export enum AuthCodeVerifyResult {
  SUCCESS = 'SUCCESS',
  EXPIRED = 'EXPIRED',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
}

export function authCodeMessage(r: AuthCodeVerifyResult): string {
  switch (r) {
    case AuthCodeVerifyResult.SUCCESS:
      return '인증이 성공했습니다.';
    case AuthCodeVerifyResult.EXPIRED:
      return '인증번호가 만료되었습니다.';
    case AuthCodeVerifyResult.INVALID:
      return '인증번호가 일치하지 않습니다.';
    case AuthCodeVerifyResult.NOT_FOUND:
      return '해당 이메일에 인증 요청이 없습니다.';
  }
}

@Injectable()
export class JammitEmailCodeService {
  private readonly mem = new Map<string, { code: string; expireAt: number }>();
  private readonly prefix = 'jammit:email:auth:';

  constructor(private readonly redis: RedisService) {}

  async saveCode(email: string, code: string, expireSeconds: number): Promise<void> {
    const key = this.prefix + email;
    await this.redis.setEx(key, code, expireSeconds);
    this.mem.set(email, {
      code,
      expireAt: Date.now() + expireSeconds * 1000,
    });
  }

  async verifyCode(email: string, code: string): Promise<AuthCodeVerifyResult> {
    const key = this.prefix + email;
    const fromRedis = await this.redis.get(key);
    if (fromRedis != null) {
      if (fromRedis === code) {
        await this.redis.del(key);
        this.mem.delete(email);
        return AuthCodeVerifyResult.SUCCESS;
      }
      return AuthCodeVerifyResult.INVALID;
    }

    const info = this.mem.get(email);
    if (!info) return AuthCodeVerifyResult.NOT_FOUND;
    if (Date.now() > info.expireAt) {
      this.mem.delete(email);
      return AuthCodeVerifyResult.EXPIRED;
    }
    if (info.code === code) {
      this.mem.delete(email);
      return AuthCodeVerifyResult.SUCCESS;
    }
    return AuthCodeVerifyResult.INVALID;
  }

  /** 검증 + HTTP 상태·`CommonResponseDto` (컨트롤러는 status만 적용) */
  async verifyCodeHttp(
    email: string,
    code: string,
  ): Promise<EmailVerifyCodeHttpResult> {
    const result = await this.verifyCode(email, code);
    const message = authCodeMessage(result);
    const payload = {
      success: result === AuthCodeVerifyResult.SUCCESS,
      message,
    };
    switch (result) {
      case AuthCodeVerifyResult.SUCCESS:
        return { statusCode: 200, body: CommonResponseDto.ok(payload) };
      case AuthCodeVerifyResult.EXPIRED:
        return {
          statusCode: 440,
          body: CommonResponseDto.fail(440, message, payload),
        };
      case AuthCodeVerifyResult.INVALID:
        return {
          statusCode: 401,
          body: CommonResponseDto.fail(401, message, payload),
        };
      case AuthCodeVerifyResult.NOT_FOUND:
      default:
        return {
          statusCode: 404,
          body: CommonResponseDto.fail(404, message, payload),
        };
    }
  }
}
