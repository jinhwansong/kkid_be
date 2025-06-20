import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({
        example: 'b1a8f3e1-3b0f-4e9b-98a2-c4f0e6d3a3b4',
        description: '영상 UUID',
    })
    videoId: string;
    @ApiProperty({
        example: "탕탕후루후루 탕탕 후루루루루",
        description: '댓글내용',
    })
    @IsString()
    @MaxLength(200)
    content:string;
}

export class GetCommentDto{
  @ApiProperty({ example: 'abc123-uuid', description: '댓글 ID' })
  id: string;

  @ApiProperty({ example: 'u123', description: '작성자 유저 ID' })
  userId: string;

  @ApiProperty({ example: '김코드', description: '작성자 닉네임' })
  nickname: string;

  @ApiProperty({ example: 'https://cdn.example.com/profile.jpg', description: '작성자 프로필 이미지' })
  profileImage: string;

  @ApiProperty({ example: '이 영상 너무 좋아요!', description: '댓글 내용' })
  content: string;

  @ApiProperty({ example: '2025-06-20T12:34:56.000Z', description: '작성일시' })
  createdAt: Date;
  
}