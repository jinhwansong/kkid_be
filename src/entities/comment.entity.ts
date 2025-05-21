import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from './user.entity';
import { Video } from './video.entity';

@Entity({ schema: 'Jimmit', name: 'comment' })
export class Comment {
  @ApiProperty({
    example: 'b1a8f3e1-3b0f-4e9b-98a2-c4f0e6d3a3b4',
    description: '댓글 UUID',
    required: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '다같이 아이스크림 췃어요',
    description: '비디오 내용',
    required: true,
  })
  @Column({ type: 'varchar', nullable: false })
  content: string;
  @ApiProperty({
    example: '2023-05-09T12:34:56Z',
    description: '댓글 생성일',
    required: false,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-05-09T12:34:56Z',
    description: '댓글 수정일',
    required: false,
  })
  @UpdateDateColumn()
  updatedAt: Date;
  // 댓글 남긴 사람
  @ManyToOne(() => User, (user) => user.comment, { onDelete: 'CASCADE' })
  user: User;
  // 대상 비디오
  @ManyToOne(() => Video, (video) => video.comment, { onDelete: 'CASCADE' })
  video: Video;
  // 부모 댓글
  @ManyToOne(() => Comment, (comment) => comment.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: Comment;
  // 자식 댓글
  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];
}
