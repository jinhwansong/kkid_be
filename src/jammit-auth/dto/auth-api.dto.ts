import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class JammitLoginRequestDto {
  @ApiProperty({ example: 'user@example.com', description: '로그인 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: '비밀번호' })
  @IsString()
  @MinLength(1)
  password: string;
}

export class JammitRefreshRequestDto {
  @ApiProperty({ description: '발급받은 JWT refresh token' })
  @IsString()
  @MinLength(1)
  refreshToken: string;
}

export class JammitEmailRequestDto {
  @ApiProperty({ example: 'user@example.com', description: '인증 코드를 받을 이메일' })
  @IsEmail()
  email: string;
}

export class JammitVerifyCodeRequestDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: '이메일로 받은 6자리 코드' })
  @IsString()
  @MinLength(4)
  code: string;
}
