import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { DelphiRound } from './delphi-round.entity';
import { Recommendation } from './recommendation.entity';
import { User } from './user.entity';

export enum VoteType {
  STRONGLY_AGREE = 'strongly_agree',
  AGREE = 'agree',
  NEUTRAL = 'neutral',
  DISAGREE = 'disagree',
  STRONGLY_DISAGREE = 'strongly_disagree'
}

@Entity('delphi_votes')
@Unique(['round', 'recommendation', 'voter'])
export class DelphiVote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DelphiRound)
  @JoinColumn({ name: 'round_id' })
  round: DelphiRound;

  @ManyToOne(() => Recommendation)
  @JoinColumn({ name: 'recommendation_id' })
  recommendation: Recommendation;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'voter_id' })
  voter: User;

  @Column()
  vote: VoteType;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ default: false })
  is_anonymous: boolean;

  @CreateDateColumn()
  created_at: Date;
}
