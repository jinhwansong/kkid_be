import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Like } from './like.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity({ schema: 'Jimmit', name: 'video' })
export class Video {
  @ApiProperty({
    example: 'b1a8f3e1-3b0f-4e9b-98a2-c4f0e6d3a3b4',
    description: '영상 UUID',
    required: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '재미있게 합주한 아이스크림',
    description: '비디오 제목',
    required: true,
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '다같이 아이스크림 췃어요',
    description: '비디오 내용',
    required: true,
  })
  @Column({ type: 'varchar', nullable: false })
  description: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'https://mybucket.com/video/1234.mp4',
    description: '비디오 저장 경로 또는 URL',
    required: true,
  })
  @Column({ type: 'varchar', nullable: false })
  videoUrl: string;
  @ApiProperty({
    example: 0,
    description: '조회수',
    required: true,
  })
  @Column({ default: 0 })
  viewCount: number;
  @ApiProperty({
    example: 'https://picsum.photos/200/300',
    description: '썸네일',
    required: true,
  })
  @Column({ type: 'varchar', nullable: true })
  thumbnailUrl: string;
  @ApiProperty({
    example: '2023-05-09T12:34:56Z',
    description: '비디오 생성일',
    required: false,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-05-09T12:34:56Z',
    description: '비디오 수정일',
    required: false,
  })
  @UpdateDateColumn()
  updatedAt: Date;
  // 좋아요 관계
  @OneToMany(() => Like, (like) => like.video)
  like: Like[];
  // 비디오를 업로드한 사람
  @ManyToOne(() => User, (user) => user.video, { onDelete: 'CASCADE' })
  user: User;
  // 댓글 관계
  @OneToMany(() => Comment, (comment) => comment.video)
  comment: Comment[];
}
