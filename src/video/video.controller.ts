import { AuthVerificationService } from '@/auth-verification/auth-verification.service';
import { MuxService } from '@/mux/mux.service';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import * as multer from 'multer';
import { MuxUploadResponseDto, RegisterMuxVideoDto } from './dto/mux.dto';
import { CreateUserDto, GetMyVideoDto, VideoResponseDto } from './dto/video.dto';
import { VideoService } from './video.service';

@UseInterceptors(
  FileInterceptor('video', {
    storage: multer.memoryStorage(),
  }),
)
@ApiTags('Video')
@Controller('video')
@ApiBearerAuth('access-token')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly muxService: MuxService,
    private readonly authVerifService: AuthVerificationService,
  ) {}
 
  @ApiOperation({ summary: '내가 업로드한 영상' })
  @ApiResponse({
    status: 201,
    description: '업로드한 영상 목록입니다.',
    type: GetMyVideoDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: '가져올 개수',
    example: 10,
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['latest', 'popular'],
    example: 'latest',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: '넘길 개수',
    example: 0,
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Access token in the format: Bearer <token>',
    required: true,
  })
  @Get('my')
  async getMyVideos(
    @Headers('authorization') authHeader: string,
    @Query('take') take = 10,
    @Query('skip') skip = 0,
    @Query('order') order: 'latest' | 'popular' = 'latest',
  ) {
    const token = authHeader?.replace('Bearer', '').trim();
    const user = await this.authVerifService.verifyTokenAndGetUser(token);
    console.log('유저정보 반환', user)
    return this.videoService.getMyVideos(user, +take, +skip, order);
  }
  @ApiOperation({ summary: '숏츠 영상 무한스크롤 조회' })
  @ApiResponse({
    status: 200,
    description: '숏츠 영상 무한스크롤 조회 목록입니다.',
    type: GetMyVideoDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: '가져올 개수',
    example: 10,
  })
  @ApiQuery({
    name: 'lastCursor',
    required: false,
    type: String,
    description: '이전 마지막 createdAt',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['latest', 'popular'],
    example: 'latest',
  })
  @Get('')
  async getVideos(
    @Query('take') take = 10,
    @Query('lastCursor') lastCursor?: string,
    @Query('order') order: 'latest' | 'popular' = 'latest',
  ) {
    return this.videoService.getVideos(
      +take,
      lastCursor ? new Date(lastCursor) : undefined,
      order,
    );
  }

  @ApiOperation({ summary: '영상 좋아요' })
  @Post('like/:videoId')
  async toggleLike(
    @Param('videoId') videoId: string,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader?.replace('Bearer', '');
    const user = await this.authVerifService.verifyTokenAndGetUser(token);
    return this.videoService.toggleLike(videoId, user);
  }
  @ApiOperation({ summary: 'Mux upload용 URL 발급' })
  @ApiResponse({
    status: 201,
    description: 'Direct Upload용 Mux URL 발급',
    type: MuxUploadResponseDto,
  })
  @Post('uploadUrl')
  async getUploadUrl(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer', '');
    const user = await this.authVerifService.verifyTokenAndGetUser(token);
    return this.muxService.createDirectUpload(user);
  }
  @ApiOperation({ summary: 'Mux 업로드 완료 후 등록 요청' })
  @ApiResponse({
    status: 201,
    description: 'Mux 영상 등록 성공',
    type: VideoResponseDto,
  })
  @Post('register')
  async registerMuxVideo(
    @Body() body: RegisterMuxVideoDto,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader?.replace('Bearer', '');
    const user = await this.authVerifService.verifyTokenAndGetUser(token);

    return this.videoService.registerMuxVideo(user, body);
  }
  @ApiOperation({ summary: '웹훅' })
  @Post('webhook/mux')
  @HttpCode(200)
  async muxWebHook(@Body() payload: any) {
    return this.videoService.muxWebHook(payload);
  }
  @ApiOperation({ summary: '조회수 증가' })
  @Post(':videoId')
  async viewCountVideos(
    @Param('videoId') videoId: string,
    @Req() req: Request,
    @Headers('authorization') authHeader?: string,
    @Headers('x-forwarded-for') ip?: string,
  ) {
    let info: CreateUserDto;
    // 로그인 한 사람꺼만
    if (authHeader) {
      const token = authHeader?.replace('Bearer', '');
      const user = await this.authVerifService.verifyTokenAndGetUser(token);
      info = { email: user.email, username: user.username };
    } else {
      info = { email: 'test@example.com', username: 'test' };
    }
    // 로그인 안한 친구는 ip 내놔....
    const clientIp = ip || req.socket.remoteAddress || 'unknown';
    return this.videoService.viewCountVideos(videoId, info, clientIp);
  }
}

