import { User } from '@/common/decorators/current-user.decorator';
import { AuthOptionalGuard } from '@/common/guards/auth-optional.guard';
import { AuthGuard } from '@/common/guards/auth.guard';
import { MuxService } from '@/mux/mux.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Ip,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import * as multer from 'multer';
import { MuxUploadResponseDto, RegisterMuxVideoDto } from './dto/mux.dto';
import { CreateUserDto } from './dto/user.dto';
import { VideoListFlatDto, VideoResponseDto } from './dto/video.dto';
import { VideoService } from './video.service';

@UseInterceptors(
  FileInterceptor('video', {
    storage: multer.memoryStorage(),
  }),
)
@ApiTags('Video')
@Controller('video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly muxService: MuxService,
  ) {}

  @ApiOperation({ summary: '전체 영상 목록' })
  @ApiResponse({
    status: 200,
    description: '페이지네이션된 영상 목록',
    type: [VideoListFlatDto],
  })
  @ApiResponse({ status: 500, description: '목록 조회 실패' })
  @ApiQuery({ name: 'page', required: true, example: 1, description: '페이지 (1부터)' })
  @ApiQuery({ name: 'take', required: true, example: 10, description: '페이지 크기' })
  @ApiQuery({ name: 'order', required: true, enum: ['latest', 'popular'], example: 'latest' })
  @Get('')
  async getVideosWithPagination(
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
    @Query('order') order: 'latest' | 'popular',
  ) {
    return this.videoService.getVideosWithPagination(take, page, order);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '유저별 업로드 영상 목록' })
  @ApiResponse({
    status: 200,
    description: '해당 유저가 올린 영상',
    type: VideoListFlatDto,
  })
  @ApiResponse({ status: 401, description: '미인증' })
  @ApiQuery({
    name: 'userId',
    required: false,
    example: 1,
    description: 'Jammit users.id — 없으면 토큰 유저 본인',
  })
  @ApiQuery({ name: 'page', required: true, example: 1 })
  @ApiQuery({ name: 'take', required: true, example: 10 })
  @ApiQuery({ name: 'order', required: true, enum: ['latest', 'popular'] })
  @Get('user')
  async getMyVideos(
    @User() user: CreateUserDto,
    @Query('userId', new ParseIntPipe({ optional: true })) userId: number | undefined,
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
    @Query('order') order: 'latest' | 'popular',
  ) {
    const targetUserId = userId ?? user.id;
    return this.videoService.getMyVideos(targetUserId, take, page, order);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '유저별 업로드 영상 개수' })
  @ApiResponse({
    status: 200,
    description: '{ count, message }',
    schema: {
      example: {
        count: 12,
        message: '업로드한 영상 개수를 조회했습니다.',
      },
    },
  })
  @ApiResponse({ status: 401, description: '미인증' })
  @ApiQuery({
    name: 'userId',
    required: false,
    example: 1,
    description: 'Jammit users.id — 없으면 본인',
  })
  @Get('user/count')
  async getMyVideoTotal(
    @User() user: CreateUserDto,
    @Query('userId', new ParseIntPipe({ optional: true })) userId: number | undefined,
  ) {
    const targetUserId = userId ?? user.id;
    return this.videoService.getMyVideoTotal(targetUserId);
  }

  @ApiOperation({ summary: 'Mux 업로드 처리 상태', description: 'uploadId 기준 playback 준비 여부' })
  @ApiQuery({ name: 'uploadId', required: true, example: 'abc-upload-id' })
  @ApiResponse({
    status: 200,
    schema: {
      example: { playbackId: 'xxxxx', status: 'ready' },
    },
  })
  @Get('status')
  async getMuxStatus(@Query('uploadId') uploadId: string) {
    return this.videoService.getAssetStatus(uploadId);
  }

  @ApiOperation({ summary: '영상 상세' })
  @ApiParam({ name: 'videoId', description: '영상 UUID' })
  @ApiResponse({ status: 200, description: '상세 JSON', type: VideoResponseDto })
  @ApiResponse({ status: 404, description: '영상 없음' })
  @ApiResponse({ status: 500, description: '조회 오류' })
  @Get(':videoId')
  async getVideosWithDetail(@Param('videoId') videoId: string) {
    return this.videoService.getVideosWithDetail(videoId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '좋아요 토글' })
  @ApiParam({ name: 'videoId', description: '영상 UUID' })
  @ApiResponse({
    status: 201,
    description: '좋아요/취소 결과',
    schema: {
      example: { message: '좋아요', liked: true, likeCount: 5 },
    },
  })
  @ApiResponse({ status: 401, description: '미인증' })
  @ApiResponse({ status: 404, description: '영상 없음' })
  @ApiResponse({ status: 500, description: '처리 오류' })
  @Post('like/:videoId')
  async toggleLike(@Param('videoId') videoId: string, @User() user?: CreateUserDto) {
    return this.videoService.toggleLike(videoId, user);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '좋아요 여부·개수' })
  @ApiParam({ name: 'videoId' })
  @ApiResponse({
    status: 200,
    schema: { example: { liked: true, likeCount: 10 } },
  })
  @ApiResponse({ status: 401, description: '미인증' })
  @Get('like-status/:videoId')
  async getLikeStatus(@Param('videoId') videoId: string, @User() user?: CreateUserDto) {
    return this.videoService.getLikeStatus(videoId, user.id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Mux Direct Upload URL 발급' })
  @ApiResponse({ status: 201, type: MuxUploadResponseDto })
  @ApiResponse({ status: 401, description: '미인증' })
  @Post('uploadUrl')
  async getUploadUrl(@User() user: CreateUserDto) {
    return this.muxService.createDirectUpload(user);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '업로드 완료 후 영상 등록', description: 'Mux 메타와 제목·설명 등 저장' })
  @ApiBody({ type: RegisterMuxVideoDto })
  @ApiResponse({ status: 201, description: '등록 결과' })
  @ApiResponse({ status: 401, description: '미인증' })
  @ApiResponse({ status: 500, description: '등록 실패' })
  @Post('register')
  async registerMuxVideo(@Body() body: RegisterMuxVideoDto, @User() user: CreateUserDto) {
    return this.videoService.registerMuxVideo(user, body);
  }

  @ApiOperation({
    summary: 'Mux 웹훅',
    description: 'Raw JSON body + Mux-Signature. Swagger에서는 서명 검증이 어려우므로 실제는 Mux/Postman 등으로 호출.',
  })
  @ApiResponse({ status: 200, description: '{ received: true }' })
  @ApiResponse({ status: 403, description: '서명 불일치' })
  @Post('webhook/mux')
  @HttpCode(200)
  async muxWebHook(@Req() req: Request, @Res() res: Response) {
    return this.videoService.muxWebHook(req, res);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthOptionalGuard)
  @ApiOperation({
    summary: '조회수 증가',
    description: '로그인 시 회원 UUID 기준, 비로그인 시 IP. Authorization 헤더는 선택.',
  })
  @ApiParam({ name: 'videoId', description: '영상 UUID' })
  @ApiHeader({
    name: 'x-forwarded-for',
    required: false,
    description: '프록시 뒤 비회원 IP (선택)',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        message: '조회수 처리 완료',
        videoId: '3520e5b7-af1b-405c-af5c-b0511635c6fa',
        viewCount: 42,
      },
    },
  })
  @ApiResponse({ status: 400, description: '유저·IP 식별 불가' })
  @ApiResponse({ status: 404, description: '영상 없음' })
  @Post(':videoId')
  async viewCountVideos(
    @Param('videoId') videoId: string,
    @Req() req: Request,
    @User() user?: CreateUserDto,
    @Ip() ip?: string,
  ) {
    const clientIp = ip || req.socket.remoteAddress || 'unknown';
    return this.videoService.viewCountVideos(videoId, user, clientIp);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '영상 삭제', description: '본인 업로드만' })
  @ApiParam({ name: 'videoId' })
  @ApiResponse({ status: 200, schema: { example: { message: '영상이 삭제되었습니다.' } } })
  @ApiResponse({ status: 401, description: '미인증' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @ApiResponse({ status: 404, description: '영상 없음' })
  @Delete(':videoId')
  async deleteVideo(@Param('videoId') videoId: string, @User() userId: CreateUserDto) {
    return this.videoService.deleteVideo(videoId, userId.id);
  }
}
