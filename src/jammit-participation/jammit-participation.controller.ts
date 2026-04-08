import { CurrentJammitUser } from '@/common/decorators/current-jammit-user.decorator';
import { CommonResponseDto } from '@/common/dto/api-response.dto';
import { AuthGuard } from '@/common/guards/auth.guard';
import { JammitUser } from '@/database/entities';
import { BandSession } from '@/jammit-shared/jammit.enums';
import {
  Body,
  Controller,
  DefaultValuePipe,
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
import { JammitParticipationService } from './jammit-participation.service';

@ApiTags('Jammit Participation')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('gatherings/:gatheringId/participants')
export class JammitParticipationController {
  constructor(private readonly svc: JammitParticipationService) {}

  @Post()
  @ApiOperation({ summary: '모임 참가 신청' })
  @ApiParam({ name: 'gatheringId', type: Number })
  @ApiBody({
    schema: {
      example: {
        bandSession: 'VOCAL',
        introduction: '안녕하세요, 보컬 지원합니다.',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'CommonResponseDto' })
  @ApiResponse({ status: 401, description: '미인증' })
  async participate(
    @Param('gatheringId', ParseIntPipe) gatheringId: number,
    @CurrentJammitUser() user: JammitUser,
    @Body() body: { bandSession: BandSession; introduction?: string },
  ) {
    const res = await this.svc.participate(
      gatheringId,
      user,
      body.bandSession,
      body.introduction,
    );
    return CommonResponseDto.ok(res);
  }

  @Put(':participantId/cancel')
  @ApiOperation({ summary: '참가 신청 취소', description: '본인 신청만' })
  @ApiParam({ name: 'gatheringId', type: Number })
  @ApiParam({ name: 'participantId', type: Number })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  async cancel(
    @Param('gatheringId', ParseIntPipe) gatheringId: number,
    @Param('participantId', ParseIntPipe) participantId: number,
    @CurrentJammitUser() user: JammitUser,
  ) {
    const res = await this.svc.cancelParticipation(gatheringId, participantId, user);
    return CommonResponseDto.ok(res);
  }

  @Post(':participantId/approve')
  @ApiOperation({ summary: '참가 승인', description: '모임 개설자' })
  @ApiParam({ name: 'gatheringId', type: Number })
  @ApiParam({ name: 'participantId', type: Number })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  async approve(
    @Param('gatheringId', ParseIntPipe) gatheringId: number,
    @Param('participantId', ParseIntPipe) participantId: number,
    @CurrentJammitUser() user: JammitUser,
  ) {
    const res = await this.svc.approveParticipation(gatheringId, participantId, user);
    return CommonResponseDto.ok(res);
  }

  @Put(':participantId/reject')
  @ApiOperation({ summary: '참가 거절', description: '모임 개설자' })
  @ApiParam({ name: 'gatheringId', type: Number })
  @ApiParam({ name: 'participantId', type: Number })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  async reject(
    @Param('gatheringId', ParseIntPipe) gatheringId: number,
    @Param('participantId', ParseIntPipe) participantId: number,
    @CurrentJammitUser() user: JammitUser,
  ) {
    const res = await this.svc.rejectParticipation(gatheringId, participantId, user);
    return CommonResponseDto.ok(res);
  }

  @Get()
  @ApiOperation({ summary: '모임별 참가자 목록', description: '공개 조회' })
  @ApiParam({ name: 'gatheringId', type: Number })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  async list(@Param('gatheringId', ParseIntPipe) gatheringId: number) {
    const res = await this.svc.findParticipants(gatheringId);
    return CommonResponseDto.ok(res);
  }

  @Get('my/completed')
  @ApiOperation({
    summary: '내가 완료한 모임 목록',
    description: '경로에 gatheringId가 있으나 서비스는 로그인 유저 기준 전체 완료 목록을 반환합니다.',
  })
  @ApiParam({ name: 'gatheringId', type: Number })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  async myCompleted(@CurrentJammitUser() user: JammitUser) {
    const res = await this.svc.getMyCompletedGatherings(user);
    return CommonResponseDto.ok(res);
  }

  @Get('my')
  @ApiOperation({ summary: '내 참가 신청·참여 목록' })
  @ApiParam({ name: 'gatheringId', type: Number })
  @ApiQuery({ name: 'includeCanceled', required: false, example: false })
  @ApiQuery({ name: 'page', required: false, example: 0 })
  @ApiQuery({ name: 'size', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  async my(
    @CurrentJammitUser() user: JammitUser,
    @Query('includeCanceled', new DefaultValuePipe(false), ParseBoolPipe)
    includeCanceled: boolean,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    const res = await this.svc.getMyParticipations(user, page, size, includeCanceled);
    return CommonResponseDto.ok(res);
  }
}
