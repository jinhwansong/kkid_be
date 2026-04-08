import { CurrentJammitUser } from '@/common/decorators/current-jammit-user.decorator';
import { CommonResponseDto } from '@/common/dto/api-response.dto';
import { AuthGuard } from '@/common/guards/auth.guard';
import { JammitUser } from '@/database/entities';
import { BandSession, Genre } from '@/jammit-shared/jammit.enums';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JammitGatheringService } from './jammit-gathering.service';
import { JammitParticipationService } from '../jammit-participation/jammit-participation.service';

@ApiTags('Jammit Gathering')
@Controller('gatherings')
export class JammitGatheringController {
  constructor(
    private readonly gathering: JammitGatheringService,
    private readonly participation: JammitParticipationService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '모임 목록(공개)',
    description: '장르·세션 필터, 페이지네이션',
  })
  @ApiQuery({ name: 'page', required: false, example: 0, description: '0부터' })
  @ApiQuery({ name: 'size', required: false, example: 20 })
  @ApiQuery({
    name: 'genres',
    required: false,
    isArray: true,
    enum: Genre,
    description: '필터 장르 (복수 가능)',
  })
  @ApiQuery({
    name: 'sessions',
    required: false,
    isArray: true,
    enum: BandSession,
    description: '필터 세션 (복수 가능)',
  })
  @ApiQuery({ name: 'sort', required: false, description: '정렬 키 (백엔드 규약)' })
  @ApiResponse({ status: 200, description: '모임 목록 페이지' })
  async list(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(20), ParseIntPipe) size: number,
    @Query('genres') genres?: Genre | Genre[],
    @Query('sessions') sessions?: BandSession | BandSession[],
    @Query('sort') sort?: string | string[],
  ) {
    const g = genres == null ? undefined : Array.isArray(genres) ? genres : [genres];
    const s =
      sessions == null ? undefined : Array.isArray(sessions) ? sessions : [sessions];
    return this.gathering.findGatherings(g, s, page, size, sort);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('my/created')
  @ApiOperation({ summary: '내가 만든 모임 목록' })
  @ApiQuery({ name: 'includeCanceled', required: false, example: false })
  @ApiQuery({ name: 'page', required: false, example: 0 })
  @ApiQuery({ name: 'size', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  @ApiResponse({ status: 401, description: '미인증' })
  async myCreated(
    @CurrentJammitUser() user: JammitUser,
    @Query('includeCanceled', new DefaultValuePipe(false), ParseBoolPipe)
    includeCanceled: boolean,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    const res = await this.gathering.getMyCreated(user, includeCanceled, page, size);
    return CommonResponseDto.ok(res);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('my/participations')
  @ApiOperation({ summary: '내가 참가 신청·참여한 모임 목록' })
  @ApiQuery({ name: 'includeCanceled', required: false, example: false })
  @ApiQuery({ name: 'page', required: false, example: 0 })
  @ApiQuery({ name: 'size', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  @ApiResponse({ status: 401, description: '미인증' })
  async myParticipations(
    @CurrentJammitUser() user: JammitUser,
    @Query('includeCanceled', new DefaultValuePipe(false), ParseBoolPipe)
    includeCanceled: boolean,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    const res = await this.participation.getMyParticipations(
      user,
      page,
      size,
      includeCanceled,
    );
    return CommonResponseDto.ok(res);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('my/completed')
  @ApiOperation({ summary: '내가 완료한 모임 목록 (영상 업로드 연동 등)' })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  @ApiResponse({ status: 401, description: '미인증' })
  async myCompletedGatherings(@CurrentJammitUser() user: JammitUser) {
    const res = await this.participation.getMyCompletedGatherings(user);
    return CommonResponseDto.ok(res);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: '모임 생성' })
  @ApiBody({
    schema: {
      example: {
        name: '주말 합주',
        thumbnail: 'https://example.com/thumb.jpg',
        place: '서울',
        description: '초보도 환영',
        gatheringDateTime: '2026-05-01T14:00:00.000Z',
        recruitDateTime: '2026-04-25T23:59:59.000Z',
        genres: ['ROCK', 'POP'],
        gatheringSessions: [
          { bandSession: 'VOCAL', recruitCount: 2 },
          { bandSession: 'DRUM', recruitCount: 1 },
        ],
      },
    },
  })
  @ApiResponse({ status: 201, description: '생성된 모임 (CommonResponseDto)' })
  @ApiResponse({ status: 401, description: '미인증' })
  async create(@CurrentJammitUser() user: JammitUser, @Body() body: Record<string, unknown>) {
    const res = await this.gathering.createGathering(user, {
      name: body.name as string,
      thumbnail: body.thumbnail as string | undefined,
      place: body.place as string,
      description: body.description as string,
      gatheringDateTime: body.gatheringDateTime as string,
      recruitDateTime: body.recruitDateTime as string,
      genres: (body.genres as Genre[]) ?? [],
      gatheringSessions:
        (body.gatheringSessions as {
          bandSession: BandSession;
          recruitCount: number;
        }[]) ?? [],
    });
    return CommonResponseDto.ok(res);
  }

  @Get(':id')
  @ApiOperation({ summary: '모임 상세(공개)' })
  @ApiParam({ name: 'id', type: Number, description: 'gathering id' })
  @ApiResponse({ status: 200, description: '모임 상세' })
  @ApiResponse({ status: 404, description: '없음' })
  async detail(@Param('id', ParseIntPipe) id: number) {
    return this.gathering.getDetail(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiOperation({ summary: '모임 수정', description: '개설자만 가능' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    schema: {
      example: {
        name: '수정된 이름',
        place: '부산',
        description: '설명 변경',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  @ApiResponse({ status: 401, description: '미인증' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentJammitUser() user: JammitUser,
    @Body() body: Record<string, unknown>,
  ) {
    const res = await this.gathering.updateGathering(id, user, body);
    return CommonResponseDto.ok(res);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: '모임 취소', description: '개설자만 가능' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  @ApiResponse({ status: 401, description: '미인증' })
  async cancel(@Param('id', ParseIntPipe) id: number, @CurrentJammitUser() user: JammitUser) {
    await this.gathering.cancelGathering(id, user);
    return CommonResponseDto.ok(null);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Put(':id/complete')
  @ApiOperation({ summary: '모임 완료 처리', description: '개설자만 가능' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  @ApiResponse({ status: 401, description: '미인증' })
  async complete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentJammitUser() user: JammitUser,
  ) {
    await this.participation.completeGathering(id, user);
    return CommonResponseDto.ok(null);
  }
}
