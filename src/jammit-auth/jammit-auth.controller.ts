import { Body, Controller, Post, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CommonResponseDto } from '@/common/dto/api-response.dto';
import { JammitEmailCodeService } from './jammit-email-code.service';
import { JammitMailService } from './jammit-mail.service';
import { JammitAuthService } from './jammit-auth.service';
import {
  JammitEmailRequestDto,
  JammitLoginRequestDto,
  JammitRefreshRequestDto,
  JammitVerifyCodeRequestDto,
} from './dto/auth-api.dto';

@ApiTags('Jammit Auth')
@Controller('auth')
export class JammitAuthController {
  constructor(
    private readonly auth: JammitAuthService,
    private readonly emailCode: JammitEmailCodeService,
    private readonly mail: JammitMailService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: '로그인', description: '이메일·비밀번호로 로그인, access/refresh 토큰 발급' })
  @ApiBody({ type: JammitLoginRequestDto })
  @ApiOkResponse({
    description: '성공 시 CommonResponseDto, result에 토큰·유저 정보',
    schema: {
      example: {
        success: true,
        code: 200,
        message: 'OK',
        result: { accessToken: '…', refreshToken: '…', user: {} },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: '이메일 또는 비밀번호 불일치' })
  async login(@Body() body: JammitLoginRequestDto) {
    const res = await this.auth.login(body.email, body.password);
    return CommonResponseDto.ok(res);
  }

  @Post('refresh')
  @ApiOperation({ summary: '토큰 갱신', description: 'refresh token으로 새 access token 발급' })
  @ApiBody({ type: JammitRefreshRequestDto })
  @ApiOkResponse({ description: 'CommonResponseDto 래핑 결과' })
  @ApiUnauthorizedResponse({ description: '유효하지 않은 refresh token' })
  async refresh(@Body() body: JammitRefreshRequestDto) {
    const res = this.auth.refresh(body.refreshToken);
    return CommonResponseDto.ok(res);
  }

  @Post('email/send-code')
  @ApiOperation({
    summary: '이메일 인증 코드 발송',
    description: '6자리 코드를 메일로 전송 (개발/스테이징에서 로그 확인 가능할 수 있음)',
  })
  @ApiBody({ type: JammitEmailRequestDto })
  @ApiOkResponse({ description: '발송 완료 (CommonResponseDto)' })
  async sendCode(@Body() body: JammitEmailRequestDto) {
    const code = String(Math.floor(Math.random() * 900_000) + 100_000);
    await this.emailCode.saveCode(body.email, code, 180);
    await this.mail.sendHtml(
      body.email,
      '[JAMMIT] 이메일 인증번호 안내',
      `인증번호: <b>${code}</b> (3분 이내 입력)`,
    );
    return CommonResponseDto.ok(null);
  }

  @Post('email/verify-code')
  @ApiOperation({ summary: '이메일 인증 코드 검증', description: '코드 일치 시 200, 실패 시 401 등' })
  @ApiBody({ type: JammitVerifyCodeRequestDto })
  @ApiOkResponse({ description: '검증 성공 (HTTP status는 응답 본문과 함께 설정됨)' })
  @ApiUnauthorizedResponse({ description: '코드 불일치 또는 만료' })
  @ApiBadRequestResponse({ description: '잘못된 요청' })
  async verifyCode(
    @Body() body: JammitVerifyCodeRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { statusCode, body: dto } = await this.emailCode.verifyCodeHttp(
      body.email,
      body.code,
    );
    res.status(statusCode);
    return dto;
  }
}
