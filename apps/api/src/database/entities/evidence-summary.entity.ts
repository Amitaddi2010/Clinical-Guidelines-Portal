import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pico } from './pico.entity';
import { EvidenceLevel } from './recommendation.entity';

@Entity('evidence_summaries')
export class EvidenceSummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pico)
  @JoinColumn({ name: 'pico_id' })
  pico: Pico;

  @Column()
  outcome_name: string;

  @Column({ nullable: true })
  study_design: string;

  @Column({ type: 'int', nullable: true })
  no_of_studies: number;

  @Column({ type: 'int', nullable: true })
  no_of_participants: number;

  @Column({ nullable: true })
  effect_type: string;

  @Column({ nullable: true })
  effect_estimate: string;

  @Column({ nullable: true })
  confidence_interval: string;

  @Column({ nullable: true })
  certainty: EvidenceLevel;

  @Column({ type: 'json', nullable: true })
  certainty_reasons: any;

  @Column({ nullable: true })
  importance: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
