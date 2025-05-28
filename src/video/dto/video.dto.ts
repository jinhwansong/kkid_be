import { User, Video } from '@/entities';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';

export class videoUploadDto extends PickType(Video, ['title', 'description']) {
}
export class registerMuxVideoDto extends videoUploadDto {
  @ApiProperty({ example: 'upload-xyz456', description: '업로드 아이디' })
  uploadId: string;
}
export class createUserDto extends PickType(User, ['email']) {}

export class MuxVideoDto extends IntersectionType(
  PickType(Video, [
  'id',
  'title',
  'description',
  'videoUrl',
  'thumbnailUrl',
  'viewCount',
  'updatedAt',
]),
PickType(User, [
  'username',
])
){}

export class getMyVideoDto extends MuxVideoDto {
  @ApiProperty({ example: 103, description: '조회수' })
  viewCount: number;

  @ApiProperty({ example: 7, description: '좋아요 수' })
  likeCount: number;

  @ApiProperty({ example: 4, description: '댓글 수' })
  commentCount: number;
}