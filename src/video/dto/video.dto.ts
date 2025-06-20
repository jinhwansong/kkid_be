import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class VideoUploadDto {
  @ApiProperty({
    example: '재미있게 합주한 아이스크림',
    description: '비디오 제목',
  })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '다같이 아이스크림 췃어요',
    description: '비디오 설명',
  })
  @IsString()
  @MaxLength(300)
  @IsNotEmpty()
  description: string;
}



export class VideoListDto {
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
    example: 'https://picsum.photos/200/300',
    description: '썸네일 이미지 URL',
  })
  thumbnailUrl: string;

  @ApiProperty({ example: '2023-05-09T12:34:56Z', description: '생성일' })
  createdAt: Date;
  @ApiProperty({ example: '퉁퉁퉁퉁퉁퉁사후르', description: '사용자 닉네임' })
  @IsString()
  nickname: string;
  @ApiProperty({
    example: "00:00:30",
    description: '비디오 길이',
  })
  @IsNumber()
  duration: string;
}

export class VideoListFlatDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty({ type: [VideoListDto] })
  data: VideoListDto[];
}

export class VideoResponseDto extends VideoListDto{
  

  @ApiProperty({
    example: '다같이 아이스크림 췃어요',
    description: '비디오 설명',
  })
  description: string;

  @ApiProperty({
    example: 'C52Fu8r79UfIp1GX02jE8lnLBE4th5E2TwC7YfTaYnwU',
    description: '비디오 재생 URL',
  })
  playbackId: string;

  @ApiProperty({ example: 103, description: '조회수' })
  viewCount: number;

  @ApiProperty({
    example: 1,
    description: '유저 고유아이디',
  })
  @ApiProperty({ example: 7, description: '좋아요 수' })
  likeCount: number;

  @ApiProperty({ example: 4, description: '댓글 수' })
  commentCount: number;
  userId: number;
}
