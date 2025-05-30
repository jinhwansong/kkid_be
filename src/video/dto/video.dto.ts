import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VideoUploadDto {
  @ApiProperty({
    example: '재미있게 합주한 아이스크림',
    description: '비디오 제목',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '다같이 아이스크림 췃어요',
    description: '비디오 설명',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: '이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '트탈라레오', description: '사용자 이름' })
  @IsString()
  username: string;
}

export class VideoResponseDto {
  @ApiProperty({
    example: 'b1a8f3e1-3b0f-4e9b-98a2-c4f0e6d3a3b4',
    description: '영상 UUID',
  })
  id: string;

  @ApiProperty({
    example: '재미있게 합주한 아이스크림',
    description: '비디오 제목',
  })
  title: string;

  @ApiProperty({
    example: '다같이 아이스크림 췃어요',
    description: '비디오 설명',
  })
  description: string;

  @ApiProperty({
    example: 'https://mybucket.com/video/1234.mp4',
    description: '비디오 재생 URL',
  })
  videoUrl: string;

  @ApiProperty({ example: 103, description: '조회수' })
  viewCount: number;

  @ApiProperty({
    example: 'https://picsum.photos/200/300',
    description: '썸네일 이미지 URL',
  })
  thumbnailUrl: string;

  @ApiProperty({ example: '2023-05-09T12:34:56Z', description: '최종 수정일' })
  updatedAt: Date;

  @ApiProperty({ example: 'username123', description: '사용자 이름' })
  username: string;
}

export class GetMyVideoDto extends VideoResponseDto {
  @ApiProperty({ example: 103, description: '조회수' })
  viewCount: number;

  @ApiProperty({ example: 7, description: '좋아요 수' })
  likeCount: number;

  @ApiProperty({ example: 4, description: '댓글 수' })
  commentCount: number;
}