import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Section } from './section.entity';

export enum GuidelineStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  LIVING = 'living'
}

@Entity('guidelines')
export class Guideline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  short_title: string;

  @Column({ unique: true })
  icmr_ref_no: string;

  @Column()
  department: string;

  @Column({ default: GuidelineStatus.DRAFT })
  status: GuidelineStatus;

  @Column({ default: '1.0' })
  version: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  scope: string;

  @Column({ type: 'text', nullable: true })
  target_audience: string;

  @Column({ type: 'text', nullable: true })
  methodology: string;

  @Column({ type: 'datetime', nullable: true })
  expiry_date: Date;

  @Column({ default: false })
  is_living: boolean;

  @Column({ default: 'en' })
  language: string;

  @Column({ type: 'datetime', nullable: true })
  published_at: Date;

  @OneToMany(() => Section, section => section.guideline)
  sections: Section[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
