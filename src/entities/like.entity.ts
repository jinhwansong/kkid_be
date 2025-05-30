import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Video } from "./video.entity";


@Entity({ schema: 'Jimmit', name: 'like' })
// 좋아요 방지가 된데요....
@Unique(['user', 'video'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  // 좋아요 누른 사람
  @ManyToOne(() => User, (user) => user.like, { onDelete: 'CASCADE' })
  user: User;
  // 좋아요 누른 비디오
  @ManyToOne(() => Video, (video) => video.like, { onDelete: 'CASCADE' })
  video: Video;
}