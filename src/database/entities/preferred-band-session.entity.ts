import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BandSession } from '@/jammit-shared/jammit.enums';
import { JammitUser } from './jammit-user.entity';

@Entity({ name: 'preferred_band_session' })
export class PreferredBandSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JammitUser, (u) => u.userBandSessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: JammitUser;

  @Column({ name: 'band_session_name', type: 'varchar', length: 40 })
  name: BandSession;

  @Column({ name: 'band_session_priority', type: 'int' })
  priority: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
