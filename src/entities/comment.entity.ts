import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Video } from './video.entity';

@Entity({ name: 'comment' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', nullable: false })
  content: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  // 댓글 남긴 사람
  @ManyToOne(() => User, (user) => user.comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
  // 대상 비디오
  @ManyToOne(() => Video, (video) => video.comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'videoId' }) 
  video: Video;
}
