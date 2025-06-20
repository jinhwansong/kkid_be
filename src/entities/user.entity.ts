import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Video } from './video.entity';

@Entity({ schema: 'Jimmit', name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
    nullable: false,
  })
  email: string;
  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
    nullable: false,
  })
  username: string;
  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
    nullable: false,
  })
  nickname: string;
  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
    nullable: false,
  })
  userId: number;
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  profileImagePath: string;
  @CreateDateColumn()
  createdAt: Date;
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
