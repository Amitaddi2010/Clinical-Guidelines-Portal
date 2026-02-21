import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Section } from './section.entity';
import { Guideline } from './guideline.entity';
import { Pico } from './pico.entity';
import { Reference } from './reference.entity';

export enum RecommendationStrength {
  STRONG = 'strong',
  CONDITIONAL = 'conditional',
  BEST_PRACTICE = 'best_practice'
}

export enum RecommendationDirection {
  FOR = 'for',
  AGAINST = 'against'
}

export enum EvidenceLevel {
  HIGH = 'high',
  MODERATE = 'moderate',
  LOW = 'low',
  VERY_LOW = 'very_low'
}

@Entity('recommendations')
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Section)
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @ManyToOne(() => Guideline)
  @JoinColumn({ name: 'guideline_id' })
  guideline: Guideline;

  @Column({ type: 'int', default: 0 })
  order_index: number;

  @Column({ type: 'text' })
  text: string;

  @Column()
  strength: RecommendationStrength;

  @Column({ nullable: true })
  direction: RecommendationDirection;

  @Column({ nullable: true })
  evidence_level: EvidenceLevel;

  @Column({ type: 'text', nullable: true })
  certainty_rationale: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ default: 'draft' })
  status: string;

  @OneToMany(() => Pico, pico => pico.recommendation)
  picos: Pico[];

  @ManyToMany(() => Reference)
  @JoinTable({
    name: 'recommendation_references',
    joinColumn: { name: 'recommendation_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'reference_id', referencedColumnName: 'id' }
  })
  references: Reference[];

  @Column({ default: '1.0' })
  version: string;

  @Column({ type: 'datetime', nullable: true })
  published_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
