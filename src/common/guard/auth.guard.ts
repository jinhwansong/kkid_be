import { AuthVerificationService } from '@/auth-verification/auth-verification.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authVerifService: AuthVerificationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    const token = authHeader.replace(/^Bearer\s+/, '');
    try {
      const user = await this.authVerifService.verifyTokenAndGetUser(token);
      req.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}