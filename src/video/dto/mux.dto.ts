import { ApiProperty } from '@nestjs/swagger';

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
