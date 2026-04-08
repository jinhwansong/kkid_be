import { User } from '@/common/decorators/current-user.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CreateUserDto } from '@/video/dto/user.dto';
import { Body, Controller, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/comment.dto';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '댓글 목록', description: '영상별 페이지네이션' })
  @ApiResponse({
    status: 200,
    description: '페이지네이션 객체 (data: 댓글 항목 배열)',
    schema: {
      example: {
        totalCount: 0,
        totalPage: 1,
        page: 1,
        data: [],
        message: '영상에 달린 댓글 리스트를 조회했습니다.',
      },
    },
  })
  @ApiResponse({ status: 400, description: '조회 실패(잘못된 요청 등)' })
  @ApiResponse({ status: 500, description: '서버 오류' })
  @ApiQuery({ name: 'videoId', required: true, example: 'xxx-uuid', description: '영상 UUID' })
  @ApiQuery({ name: 'page', required: true, example: 1, description: '페이지 (1부터)' })
  @ApiQuery({ name: 'take', required: true, example: 10, description: '페이지 크기' })
  @Get('')
  async getComment(
    @Query('videoId') videoId: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    return this.commentService.getComment(videoId, page, take);
  }

  @ApiOperation({ summary: '댓글 작성' })
  @ApiResponse({ status: 200, description: '작성된 댓글 요약' })
  @ApiResponse({ status: 401, description: '미인증' })
  @ApiResponse({ status: 404, description: '영상 없음' })
  @ApiResponse({ status: 500, description: '댓글 쓰기 중 오류' })
  @ApiBody({ type: CreateCommentDto })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Post('')
  async createComment(@Body() body: CreateCommentDto, @User() user?: CreateUserDto) {
    return this.commentService.createComment(body, user);
  }
}
