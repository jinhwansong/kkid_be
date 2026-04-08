import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BandSession } from '@/jammit-shared/jammit.enums';
import { Gathering } from './gathering.entity';

@Entity('gathering_session')
export class GatheringSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Gathering, (g) => g.gatheringSessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gathering_id' })
  gathering: Gathering;

  @Column({ name: 'band_session_name', type: 'varchar', length: 40 })
  name: BandSession;

  @Column({ name: 'recruit_count' })
  recruitCount: number;

  @Column({ name: 'current_count', default: 0 })
  currentCount: number;
}
