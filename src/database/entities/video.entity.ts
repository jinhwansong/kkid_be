import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JammitUser } from './jammit-user.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';

@Entity({ name: 'video' })
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;
  @Column({ type: 'varchar', nullable: false, length:300 })
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
  @Column({ type: 'varchar', nullable: true,  })
  duration: string;
  @Column({ type: 'varchar', nullable: true,  })
  assetId:string

  /** 상세 URL용 숫자 키(영상마다 1개). 업로더는 `user`(JammitUser)와 다름 */
  @Column({ type: 'integer', nullable: true })
  slug: number | null;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  // 좋아요 관계
  @OneToMany(() => Like, (like) => like.video)
  like: Like[];
  // 비디오를 업로드한 사람 — Jammit `users` 와 동일 주키(id)
  @ManyToOne(() => JammitUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: JammitUser;
  // 댓글 관계
  @OneToMany(() => Comment, (comment) => comment.video)
  comment: Comment[];
}
