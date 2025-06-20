import { AuthVerificationService } from "@/auth-verification/auth-verification.service";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class AuthOptionalGuard implements CanActivate {
    constructor(private readonly authVerifService: AuthVerificationService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = (authHeader as string).replace(/^Bearer\s+/, '');
      try {
        const user = await this.authVerifService.verifyTokenAndGetUser(token);
        req.user = user;
      } catch (err) {
      }
    }
    return true;
  }
}