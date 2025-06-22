import { ApiProperty } from "@nestjs/swagger";
import { IsBase64, IsEmail, IsNumber, IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: '이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '트탈라레오', description: '사용자 이름' })
  @IsString()
  username: string;
  @ApiProperty({ example: '퉁퉁퉁퉁퉁퉁사후르', description: '사용자 닉네임' })
  @IsString()
  nickname: string;
  @ApiProperty({
    example: 1,
    description: '유저 고유아이디',
  })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'https://torip.s3.ap-northeast-2.amazonaws.com/profile/fa66881a-e362-4f34-84c8-1679a2332295.svg', description: '사용자 프로필' })
  @IsBase64()
  profileImagePath:string
}