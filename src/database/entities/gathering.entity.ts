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
import { GatheringStatus } from '@/jammit-shared/jammit.enums';
import { GatheringGenre } from './gathering-genre.entity';
import { GatheringParticipant } from './gathering-participant.entity';
import { GatheringSession } from './gathering-session.entity';
import { JammitUser } from './jammit-user.entity';
import { Review } from './review.entity';

@Entity('gathering')
export class Gathering {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'gathering_name', length: 30 })
  name: string;

  @Column({ name: 'gathering_place' })
  place: string;

  @Column({ name: 'gathering_description', length: 1000 })
  description: string;

  @Column({ name: 'gathering_thumbnail', nullable: true })
  thumbnail: string | null;

  @Column({ name: 'gathering_view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'gathering_datetime', type: 'timestamp' })
  gatheringDateTime: Date;

  @Column({ name: 'recruit_deadline', type: 'timestamp' })
  recruitDeadline: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: GatheringStatus.RECRUITING,
  })
  status: GatheringStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => JammitUser, { eager: false })
  @JoinColumn({ name: 'created_by' })
  createdBy: JammitUser;

  @ManyToOne(() => JammitUser, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: JammitUser | null;

  @OneToMany(() => GatheringGenre, (gg) => gg.gathering, { cascade: true })
  genreRows: GatheringGenre[];

  @OneToMany(() => GatheringSession, (s) => s.gathering, { cascade: true })
  gatheringSessions: GatheringSession[];

  @OneToMany(() => GatheringParticipant, (p) => p.gathering)
  participants: GatheringParticipant[];

  @OneToMany(() => Review, (r) => r.gathering)
  reviews: Review[];
}
