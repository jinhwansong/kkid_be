import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gathering } from './gathering.entity';
import { JammitUser } from './jammit-user.entity';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ name: 'is_practice_helped', default: false })
  isPracticeHelped: boolean;

  @Column({ name: 'is_good_with_music', default: false })
  isGoodWithMusic: boolean;

  @Column({ name: 'is_good_with_others', default: false })
  isGoodWithOthers: boolean;

  @Column({ name: 'is_shares_practice_resources', default: false })
  isSharesPracticeResources: boolean;

  @Column({ name: 'is_managing_well', default: false })
  isManagingWell: boolean;

  @Column({ name: 'is_helpful', default: false })
  isHelpful: boolean;

  @Column({ name: 'is_good_learner', default: false })
  isGoodLearner: boolean;

  @Column({ name: 'is_keeping_promises', default: false })
  isKeepingPromises: boolean;

  @ManyToOne(() => JammitUser, { eager: true })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: JammitUser;

  @ManyToOne(() => JammitUser, { eager: true })
  @JoinColumn({ name: 'reviewee_id' })
  reviewee: JammitUser;

  @ManyToOne(() => Gathering, { eager: true })
  @JoinColumn({ name: 'gathering_id' })
  gathering: Gathering;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
