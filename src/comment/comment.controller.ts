import { User } from '@/common/decorator/user.decorator';
import { AuthGuard } from '@/common/guard/auth.guard';
import { CreateUserDto } from '@/video/dto/user.dto';
import { Body, Controller, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto, GetCommentDto } from './dto/comment.dto';

@ApiTags('Comment')
@ApiBearerAuth('access-token')
@Controller('comment')
export class CommentController {
    constructor( private readonly commentService: CommentService ){}
    @ApiOperation({summary:'댓글 리스트'})
    @ApiResponse({
        status:200,
        description:'영상에 달린 댓글 리스트',
        type:[GetCommentDto]
    })
    @ApiResponse({
        status: 500,
        description: '영상에 달린 댓글 리스트를 불러오는 중 오류가 발생했습니다.',
     })
    @ApiQuery({ name: 'videoId', required: true, example: 'xxx-uuid', description: '영상 UUID' })
    @ApiQuery({ name: 'page', required: false, example: 1, description: '페이지 번호 (1부터)' })
    @ApiQuery({ name: 'take', required: false, example: 10, description: '한 페이지당 항목 수' })
    @Get('')
    async getComment(
        @Query('videoId') videoId: string,
        @Query('page',  ParseIntPipe) page:number,
        @Query('take',  ParseIntPipe) take:number,
    ){
        return this.commentService.getComment(videoId,page,take)
    }

    @ApiOperation({summary:'댓글 쓰기'})
    @ApiResponse({
        status: 200,
        description: '댓글 쓰기입니다.',
        type: CreateCommentDto,
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
        description: '댓글 쓰기 중 오류가 발생했습니다.',
    })
    @UseGuards(AuthGuard)
    @Post('')
    async createComment(
        @Body() body: CreateCommentDto,
        @User() user?: CreateUserDto,
    ) {
    return this.commentService.createComment(body, user);
    }
}
