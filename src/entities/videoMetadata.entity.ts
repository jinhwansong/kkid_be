import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Video } from "./video.entity";

@Entity({ name: 'video_metadata' })
export class VideoMetadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', nullable: true })
  creatorName: string;

  @Column({ type: 'varchar', nullable: true })
  creatorTitle: string;

  @Column({ type: 'varchar', nullable: true })
  thumbnailUrl: string;
  @Column({ type: 'integer', nullable: true })
  slug: number;

  @OneToOne(() => Video, { onDelete: 'CASCADE' })
  @JoinColumn()
  video: Video;
}
