import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Video } from './video.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';

@Entity({ schema: 'Jimmit', name: 'user' })
export class User {
  @ApiProperty({
    example: 'b1a8f3e1-3b0f-4e9b-98a2-c4f0e6d3a3b4',
    description: '사용자 UUID',
    required: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'user@example.com',
    description: '인증된 유저 이메일',
    required: true,
  })
  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
    nullable: false,
  })
  email: string;
  @ApiProperty({
    example: '2023-05-09T12:34:56Z',
    description: '계정 생성일',
    required: false,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-05-09T12:34:56Z',
    description: '계정 정보 수정일',
    required: false,
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // 댓글 관계
  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];
  // 좋아요 관계
  @OneToMany(() => Like, (like) => like.user)
  like: Like[];
  // 업로드된 비디오 관계
  @OneToMany(() => Video, (video) => video.user)
  video: Video[];
}
