import { CurrentJammitUser } from '@/common/decorators/current-jammit-user.decorator';
import { CommonResponseDto } from '@/common/dto/api-response.dto';
import { AuthGuard } from '@/common/guards/auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JammitUser } from '@/database/entities';
import { JammitUserService } from './jammit-user.service';

@ApiTags('Jammit User')
@Controller('user')
export class JammitUserController {
  constructor(private readonly userService: JammitUserService) {}

  @Post()
  @ApiOperation({ summary: '회원가입', description: 'Jammit 계정 생성' })
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
        password: 'password123',
        username: 'jammituser',
        nickname: '닉네임',
        preferredGenres: ['ROCK', 'POP'],
        preferredBandSessions: ['VOCAL', 'ELECTRIC_GUITAR'],
      },
    },
  })
  @ApiResponse({ status: 201, description: '가입 성공 (CommonResponseDto)' })
  @ApiResponse({ status: 400, description: '이메일 중복 등' })
  async register(@Body() body: Record<string, unknown>) {
    const res = await this.userService.register({
      email: body.email as string,
      password: body.password as string,
      username: body.username as string,
      nickname: body.nickname as string,
      preferredGenres: body.preferredGenres as never,
      preferredBandSessions: body.preferredBandSessions as never,
    });
    return CommonResponseDto.ok(res);
  }

  @Get('exists')
  @ApiOperation({ summary: '이메일 중복 확인', description: '회원가입 전 사용 가능 여부' })
  @ApiQuery({ name: 'email', required: true, example: 'user@example.com' })
  @ApiResponse({ status: 200, description: '{ exists: boolean } 형태 (CommonResponseDto)' })
  async exists(@Query('email') email: string) {
    const res = await this.userService.checkEmailExists(email);
    return CommonResponseDto.ok(res);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: '내 프로필 조회', description: 'JWT 기준 로그인 유저 정보' })
  @ApiResponse({ status: 200, description: '프로필 객체 (CommonResponseDto)' })
  @ApiResponse({ status: 401, description: '미인증' })
  async me(@CurrentJammitUser() u: JammitUser) {
    return this.userService.getUserInfo(u.email);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Put()
  @ApiOperation({ summary: '내 프로필 수정' })
  @ApiBody({
    schema: {
      example: {
        email: 'new@example.com',
        username: 'newname',
        password: 'newpassword',
        preferredGenres: ['JAZZ'],
        preferredBandSessions: ['DRUM'],
      },
    },
  })
  @ApiResponse({ status: 200, description: '수정 후 프로필 (CommonResponseDto)' })
  @ApiResponse({ status: 401, description: '미인증' })
  @ApiResponse({ status: 400, description: '유저 없음 등' })
  async update(@CurrentJammitUser() u: JammitUser, @Body() body: Record<string, unknown>) {
    const res = await this.userService.updateUser(u.email, {
      email: body.email as string | undefined,
      username: body.username as string | undefined,
      password: body.password as string | undefined,
      preferredGenres: body.preferredGenres as never,
      preferredBandSessions: body.preferredBandSessions as never,
    });
    return CommonResponseDto.ok(res);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Put('image')
  @ApiOperation({ summary: '프로필 이미지 URL 갱신', description: '직접 URL을 저장할 때 사용' })
  @ApiBody({
    schema: {
      example: {
        orgFileName: 'photo.jpg',
        profileImagePath: 'https://example.com/profile/photo.jpg',
      },
    },
  })
  @ApiResponse({ status: 200, description: '갱신된 프로필 (CommonResponseDto)' })
  @ApiResponse({ status: 401, description: '미인증' })
  async updateImage(@CurrentJammitUser() u: JammitUser, @Body() body: Record<string, unknown>) {
    const res = await this.userService.updateProfileImage(u.email, {
      orgFileName: body.orgFileName as string | undefined,
      profileImagePath: body.profileImagePath as string | null | undefined,
    });
    return CommonResponseDto.ok(res);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post(':userId/profile-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '프로필 이미지 업로드', description: 'multipart file → 스토리지 업로드 후 URL 반환' })
  @ApiParam({ name: 'userId', type: Number, description: '본인 users.id 와 일치해야 함' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary', description: '이미지 파일' },
      },
    },
  })
  @ApiResponse({ status: 200, description: '업로드된 이미지 URL (CommonResponseDto)' })
  @ApiResponse({ status: 401, description: '미인증' })
  @ApiResponse({ status: 400, description: '파일 없음·유저 없음' })
  async uploadProfile(
    @Param('userId', ParseIntPipe) userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = await this.userService.uploadProfileImage(userId, file);
    return CommonResponseDto.ok(url);
  }
}
