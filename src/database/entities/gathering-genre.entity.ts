import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Genre } from '@/jammit-shared/jammit.enums';
import { Gathering } from './gathering.entity';

@Entity('gathering_genres')
export class GatheringGenre {
  @PrimaryColumn({ name: 'gathering_id' })
  gatheringId: number;

  @PrimaryColumn({ name: 'genre_name', type: 'varchar', length: 40 })
  genreName: Genre;

  @ManyToOne(() => Gathering, (g) => g.genreRows, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gathering_id' })
  gathering: Gathering;
}
