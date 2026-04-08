import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** 비디오 도메인 — `jammit-auth`의 `AuthVerificationService`가 채운 `req.user` (프로필 DTO) */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);

/** @deprecated Use `CurrentUser` — 레거시 컨트롤러 호환 */
export const User = CurrentUser;
