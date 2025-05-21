import { ApiProperty } from "@nestjs/swagger";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Video } from "./video.entity";


@Entity({ schema: 'Jimmit', name: 'like' })
// 좋아요 방지가 된데요....
@Unique(['user', 'video'])
export class Like {
  @ApiProperty({
    example: 'b1a8f3e1-3b0f-4e9b-98a2-c4f0e6d3a3b4',
    description: '좋아요 UUID',
    required: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty({
    example: '2023-05-09T12:34:56Z',
    description: '좋아요 생성일',
    required: false,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-05-09T12:34:56Z',
    description: '좋아요 수정일',
    required: false,
  })
  @UpdateDateColumn()
  updatedAt: Date;
  // 좋아요 누른 사람
  @ManyToOne(() => User, (user) => user.like, { onDelete: 'CASCADE' })
  user: User;
  // 좋아요 누른 비디오
  @ManyToOne(() => Video, (video) => video.like, { onDelete: 'CASCADE' })
  video: Video;
}