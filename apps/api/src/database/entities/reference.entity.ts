import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Guideline } from './guideline.entity';

export enum ReferenceType {
  RCT = 'rct',
  SYSTEMATIC_REVIEW = 'systematic_review',
  GUIDELINE = 'guideline',
  OBSERVATIONAL = 'observational',
  OTHER = 'other'
}

@Entity('references')
export class Reference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Guideline)
  @JoinColumn({ name: 'guideline_id' })
  guideline: Guideline;

  @Column({ nullable: true })
  pubmed_id: string;

  @Column({ nullable: true })
  doi: string;

  @Column()
  title: string;

  @Column({ type: 'simple-array', nullable: true })
  authors: string[];

  @Column({ nullable: true })
  journal: string;

  @Column({ type: 'int', nullable: true })
  year: number;

  @Column({ nullable: true })
  volume: string;

  @Column({ nullable: true })
  issue: string;

  @Column({ nullable: true })
  pages: string;

  @Column({ type: 'text', nullable: true })
  abstract: string;

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'text', nullable: true })
  citation_text: string;

  @Column({ nullable: true })
  short_name: string;

  @Column({ default: ReferenceType.OTHER })
  reference_type: ReferenceType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
