import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Video } from './video.entity';

@Entity({ schema: 'Jimmit', name: 'comment' })
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
