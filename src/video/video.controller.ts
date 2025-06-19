import { AuthVerificationService } from '@/auth-verification/auth-verification.service';
import { MuxService } from '@/mux/mux.service';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import * as multer from 'multer';
import { MuxUploadResponseDto, RegisterMuxVideoDto } from './dto/mux.dto';
import { CreateUserDto, VideoListFlatDto, VideoResponseDto } from './dto/video.dto';
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
 
  @ApiOperation({ summary: '전체 영상 목록 리스트' })
  @ApiResponse({
    status: 200,
    description: '전체 영상 목록 리스트입니다.',
    type: VideoListFlatDto,
  })
  @ApiResponse({
    status: 500,
    description: '영상 목록을 불러오는 중 오류가 발생했습니다.',
  })
  @ApiQuery({ name: 'page', required: false, example: 1, description: '페이지 번호 (1부터)' })
  @ApiQuery({ name: 'take', required: false, example: 10, description: '한 페이지당 항목 수' })
  @ApiQuery({ name: 'order', required: false, enum: ['latest', 'popular'], example: 'latest' })
  @Get('')
  async getVideosWithPagination(
    @Query('page',  ParseIntPipe) page,
    @Query('take',  ParseIntPipe) take,
    @Query('order') order: 'latest' | 'popular',
  ) {
    const skip = (page - 1) * take;
    return this.videoService.getVideosWithPagination(take, skip, order);
  }
  @ApiOperation({ summary: '내가 업로드한 영상 목록' })
  @ApiResponse({
    status: 200,
    description: '내가 업로드한 영상 목록 리스트입니다.',
    type: VideoListFlatDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  @ApiHeader({
    name: 'authorization',
    required: true,
    description: 'Bearer 액세스 토큰',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    example: 'abc123',
    description: '조회할 유저 ID (없으면 본인)',
  })
  @ApiQuery({ name: 'userId', required: false, example: 'abc123', description: '조회 대상 유저 ID (없으면 내 영상)' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: '페이지 번호 (1부터)' })
  @ApiQuery({ name: 'take', required: false, example: 10, description: '한 페이지당 항목 수' })
  @ApiQuery({ name: 'order', required: false, enum: ['latest', 'popular'], example: 'latest' })
  @Get('user')
  async getMyVideos(
    @Headers('authorization') authHeader: string,
    @Query('userId') userId: string,
    @Query('page') page = 1,
    @Query('take') take = 10,
    @Query('order') order: 'latest' | 'popular' = 'latest',
  ) {
    const token = authHeader?.replace('Bearer', '');
    const user = await this.authVerifService.verifyTokenAndGetUser(token);
    
    const targetUserId = userId || user.id;
    const skip = (page - 1) * take;
    return this.videoService.getMyVideos(targetUserId, take, skip, order);
  }
  
  @ApiOperation({ summary: '영상 목록 상세' })
  @ApiResponse({
    status: 200,
    description: '영상 목록 상세입니다.',
    type: VideoResponseDto,
  })
   @ApiResponse({
    status: 404,
    description: '해당 영상이 존재하지 않습니다.',
  })
  @ApiResponse({
    status: 500,
    description: '영상 상세데이터를 불러오는 중 오류가 발생했습니다.',
  })
  @Get(':videoId')
  async getVideosWithDetail(
    @Param('videoId') videoId: string,
  ) {
    return this.videoService.getVideosWithDetail(videoId);
  }
  
  
 
  
  
  @ApiOperation({ summary: '영상 좋아요/취소' })
  @ApiResponse({
    status: 201,
    description: '좋아요 추가 또는 취소 처리 결과',
    schema: {
      example: {
        message: '좋아요',
        liked: true,
        likeCount: 5,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 영상입니다.',
  })
  @ApiResponse({
    status: 500,
    description: '좋아요 처리 중 오류가 발생했습니다.',
  })
  @ApiHeader({
    name: 'authorization',
    required: true,
    description: 'Bearer 액세스 토큰',
  })
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
  async muxWebHook(@Req() req: Request, @Res() res: Response) {
    return this.videoService.muxWebHook(req, res);
  }
  @ApiOperation({ summary: '조회수 증가' })
  @ApiParam({ name: 'videoId', type: String, description: '조회수 증가시킬 비디오 ID' })
  @ApiHeader({
    name: 'authorization',
    required: false,
    description: 'Access token in the format: Bearer <token>',
  })
  @ApiHeader({
    name: 'x-forwarded-for',
    required: false,
    description: '비회원 식별용 IP (선택, 자동 처리됨)',
  })
  @ApiResponse({
    status: 200,
    description: '조회수 증가 성공',
    schema: {
      example: {
        message: '조회수 처리 완료',
        videoId: '3520e5b7-af1b-405c-af5c-b0511635c6fa',
        viewCount: 42,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  @ApiResponse({
    status: 400,
    description: '유저 식별이 불가능합니다.',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 영상입니다.',
  })
  @ApiResponse({
    status: 500,
    description: '조회수 처리 중 오류가 발생했습니다.',
  })
  @Post(':videoId')
  async viewCountVideos(
    @Param('videoId') videoId: string,
    @Req() req: Request,
    @Headers('authorization') authHeader?: string,
    @Headers('x-forwarded-for') ip?: string,
  ) {
     let info: CreateUserDto | undefined = undefined;
    // 로그인 한 사람꺼만
    if (authHeader) {
      const token = authHeader?.replace('Bearer', '');
      const user = await this.authVerifService.verifyTokenAndGetUser(token);
      info = { email: user.email, username: user.username, nickname:user.nickname, id: user.id };
    } 
    // 로그인 안한 친구는 ip 내놔....
    const clientIp = ip || req.socket.remoteAddress || 'unknown';
    return this.videoService.viewCountVideos(videoId, info, clientIp);
  }
  

}

