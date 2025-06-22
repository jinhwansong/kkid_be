import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { User } from './user.entity';
import { VideoMetadata } from './videoMetadata.entity';

@Entity({ schema: 'Jimmit', name: 'video' })
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

  // 메타데이터
  @OneToOne(() => VideoMetadata, (metadata) => metadata.video, { cascade: true })
  metadata: VideoMetadata;
}
