import { ApiProperty } from '@nestjs/swagger';
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
}