import { JammitUser } from './jammit-user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Video } from './video.entity';


@Entity({ name: 'like' })
// 좋아요 방지가 된데요....
@Unique(['user', 'video'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  // 좋아요 누른 사람 — Jammit `users`
  @ManyToOne(() => JammitUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: JammitUser;
  // 좋아요 누른 비디오
  @ManyToOne(() => Video, (video) => video.like, { onDelete: 'CASCADE' })
  video: Video;
}