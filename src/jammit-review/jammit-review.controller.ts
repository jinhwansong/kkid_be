import { CurrentJammitUser } from '@/common/decorators/current-jammit-user.decorator';
import { CommonResponseDto } from '@/common/dto/api-response.dto';
import { AuthGuard } from '@/common/guards/auth.guard';
import { JammitUser } from '@/database/entities';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
import { JammitReviewService } from './jammit-review.service';

@ApiTags('Jammit Review')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('review')
export class JammitReviewController {
  constructor(private readonly svc: JammitReviewService) {}

  @Post()
  @ApiOperation({ summary: '리뷰 작성' })
  @ApiBody({
    schema: {
      example: {
        gatheringId: 1,
        revieweeId: 2,
        content: '좋은 합주였습니다.',
        isPracticeHelped: true,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'CommonResponseDto' })
  @ApiResponse({ status: 401, description: '미인증' })
  async create(@CurrentJammitUser() user: JammitUser, @Body() body: Record<string, unknown>) {
    const res = await this.svc.createReview(user, body);
    return CommonResponseDto.ok(res);
  }

  @Delete(':reviewId')
  @ApiOperation({ summary: '리뷰 삭제', description: '작성자 본인' })
  @ApiParam({ name: 'reviewId', type: Number })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  async remove(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @CurrentJammitUser() user: JammitUser,
  ) {
    await this.svc.deleteReview(user.id, reviewId);
    return CommonResponseDto.ok(null);
  }

  @Get('written')
  @ApiOperation({ summary: '내가 작성한 리뷰 목록' })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  async written(@CurrentJammitUser() user: JammitUser) {
    const res = await this.svc.getWritten(user.id);
    return CommonResponseDto.ok(res);
  }

  @Get('received/statistics')
  @ApiOperation({ summary: '받은 리뷰 통계' })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  async stats(@CurrentJammitUser() user: JammitUser) {
    const res = await this.svc.getStatistics(user.id);
    return CommonResponseDto.ok(res);
  }

  @Get('received')
  @ApiOperation({ summary: '받은 리뷰 페이지' })
  @ApiQuery({ name: 'page', required: false, example: 0 })
  @ApiQuery({ name: 'pageSize', required: false, example: 8 })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  async received(
    @CurrentJammitUser() user: JammitUser,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(8), ParseIntPipe) pageSize: number,
  ) {
    const res = await this.svc.getReceivedPage(user.id, page, pageSize);
    return CommonResponseDto.ok(res);
  }

  @Get('gathering/:gatheringId')
  @ApiOperation({ summary: '모임별 리뷰 목록' })
  @ApiParam({ name: 'gatheringId', type: Number })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  async byGathering(@Param('gatheringId', ParseIntPipe) gatheringId: number) {
    const res = await this.svc.getByGathering(gatheringId);
    return CommonResponseDto.ok(res);
  }

  @Get('unwritten')
  @ApiOperation({ summary: '작성 대기 리뷰 목록' })
  @ApiResponse({ status: 200, description: 'CommonResponseDto' })
  async unwritten(@CurrentJammitUser() user: JammitUser) {
    const res = await this.svc.getUnwrittenList(user);
    return CommonResponseDto.ok(res);
  }

  @Get(':gatheringId/participants/:userId/reviews')
  @ApiOperation({
    summary: '특정 모임·유저에 대한 리뷰 페이지',
    description: '모임 개설자(owner) 권한 등 서비스 로직 따름',
  })
  @ApiParam({ name: 'gatheringId', type: Number })
  @ApiParam({ name: 'userId', type: Number, description: '리뷰 대상 users.id' })
  @ApiResponse({ status: 200, description: '리뷰 페이지 데이터' })
  async userPage(
    @CurrentJammitUser() owner: JammitUser,
    @Param('gatheringId', ParseIntPipe) gatheringId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.svc.getReviewUserPage(owner, userId, gatheringId);
  }
}
