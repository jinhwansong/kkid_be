import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Genre } from '@/jammit-shared/jammit.enums';
import { JammitUser } from './jammit-user.entity';

@Entity({ name: 'preferred_genre' })
export class PreferredGenre {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JammitUser, (u) => u.preferredGenres, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: JammitUser;

  @Column({ name: 'genre_name', type: 'varchar', length: 40 })
  name: Genre;

  @Column({ name: 'genre_priority', type: 'int' })
  priority: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
