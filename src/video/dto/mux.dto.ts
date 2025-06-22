import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { VideoUploadDto } from './video.dto';

export class MuxUploadResponseDto {
  @ApiProperty({
    example: 'https://storage.mux.com/abc123...',
    description: '프론트에서 사용할 Direct Upload URL',
  })
  uploadUrl: string;

  @ApiProperty({
    example: 'upload-xyz456',
    description: 'Mux 업로드 식별자 ID (uploadId)',
  })
  uploadId: string;
}

export class RegisterMuxVideoDto extends VideoUploadDto {
  @ApiProperty({
    example: 'upload-xyz456',
    description: '업로드 아이디',
    required: true,
  })
  uploadId: string;

  @ApiProperty({
    example: 'https://picsum.photos/200/300',
    description: '썸네일 이미지 URL',
  })
  thumbnailUrl: string;

  @ApiProperty({
    example: '재미있게 합주한 아이스크림',
    description: '비디오 제목',
  })
  @IsString()
  creatorTitle: string;
  @ApiProperty({ example: '트탈라레오', description: '사용자 이름' })
  @IsString()
  creatorName: string;

 @ApiProperty({
    example: 1,
    description: '상세페이지 아이디',
  })
  @IsNumber()
  slug: number;
}