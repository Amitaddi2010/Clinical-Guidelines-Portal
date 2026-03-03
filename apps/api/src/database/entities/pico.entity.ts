import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Recommendation } from './recommendation.entity';
import { EvidenceSummary } from './evidence-summary.entity';

export enum PicoImportance {
  CRITICAL = 'critical',
  IMPORTANT = 'important',
  NOT_IMPORTANT = 'not_important'
}

@Entity('picos')
export class Pico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Recommendation)
  @JoinColumn({ name: 'recommendation_id' })
  recommendation: Recommendation;

  @Column({ type: 'text' })
  population: string;

  @Column({ type: 'text' })
  intervention: string;

  @Column({ type: 'text' })
  comparator: string;

  @Column({ type: 'text' })
  outcome: string;

  @Column({ type: 'text', nullable: true })
  timeframe: string;

  @Column({ type: 'enum', enum: PicoImportance, default: PicoImportance.IMPORTANT })
  importance: PicoImportance;

  @OneToMany(() => EvidenceSummary, evidence_summary => evidence_summary.pico)
  evidence_summaries: EvidenceSummary[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
