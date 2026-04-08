import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BandSession, ParticipantStatus } from '@/jammit-shared/jammit.enums';
import { Gathering } from './gathering.entity';
import { JammitUser } from './jammit-user.entity';

@Entity('gathering_participant')
export class GatheringParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JammitUser, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: JammitUser;

  @ManyToOne(() => Gathering, (g) => g.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gathering_id' })
  gathering: Gathering;

  @Column({ name: 'band_session_name', type: 'varchar', length: 40 })
  name: BandSession;

  @Column({
    type: 'varchar',
    length: 20,
    default: ParticipantStatus.PENDING,
  })
  status: ParticipantStatus;

  @Column({ length: 500, nullable: true })
  introduction: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
