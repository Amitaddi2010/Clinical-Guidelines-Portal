import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { Guideline } from './guideline.entity';
import { User } from './user.entity';
import { Recommendation } from './recommendation.entity';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Guideline)
  @JoinColumn({ name: 'guideline_id' })
  guideline: Guideline;

  @ManyToOne(() => Section, { nullable: true })
  @JoinColumn({ name: 'parent_section_id' })
  parent_section: Section;

  @Column()
  title: string;

  @Column({ type: 'int', default: 0 })
  order_index: number;

  @Column({ type: 'json', nullable: true })
  content_json: any;

  @Column({ type: 'text', nullable: true })
  content_html: string;

  @Column({ default: 'draft' })
  status: string;

  @OneToMany(() => Recommendation, rec => rec.section)
  recommendations: Recommendation[];

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'locked_by' })
  locked_by: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
