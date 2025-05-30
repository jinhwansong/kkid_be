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
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;
  @Column({ type: 'varchar', nullable: false })
  description: string;
  @Column({ type: 'varchar', nullable: true })
  videoUrl: string;
  @Column({ default: 0 })
  viewCount: number;
  @Column({ type: 'varchar', nullable: true })
  thumbnailUrl: string;
  @Column({ type: 'varchar', nullable: true })
  playbackId: string;
  @Column({ type: 'varchar', nullable: true })
  uploadId: string;
  @CreateDateColumn()
  createdAt: Date;
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
