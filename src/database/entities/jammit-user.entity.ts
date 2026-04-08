import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OauthPlatform } from '@/jammit-shared/jammit.enums';
import { PreferredBandSession } from './preferred-band-session.entity';
import { PreferredGenre } from './preferred-genre.entity';

@Entity('users')
export class JammitUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30, unique: true })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 30 })
  username: string;

  @Column({ length: 30, nullable: true })
  nickname: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    name: 'oauth_platform',
    type: 'varchar',
    length: 20,
    default: OauthPlatform.NONE,
  })
  oauthPlatform: OauthPlatform;

  @Column({ name: 'org_file_name', length: 255, nullable: true })
  orgFileName: string | null;

  @Column({ name: 'profile_image_path', length: 500, nullable: true })
  profileImagePath: string | null;

  @OneToMany(() => PreferredGenre, (pg) => pg.user, { cascade: true })
  preferredGenres: PreferredGenre[];

  @OneToMany(() => PreferredBandSession, (pbs) => pbs.user, {
    cascade: true,
  })
  userBandSessions: PreferredBandSession[];
}
