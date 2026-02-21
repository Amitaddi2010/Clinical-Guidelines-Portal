import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Guideline } from './guideline.entity';
import { User } from './user.entity';

@Entity('coi_declarations')
@Unique(['guideline', 'user'])
export class CoiDeclaration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Guideline)
  @JoinColumn({ name: 'guideline_id' })
  guideline: Guideline;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: false })
  has_financial_interest: boolean;

  @Column({ type: 'text', nullable: true })
  financial_details: string;

  @Column({ default: false })
  has_intellectual_interest: boolean;

  @Column({ type: 'text', nullable: true })
  intellectual_details: string;

  @Column({ default: false })
  has_personal_interest: boolean;

  @Column({ type: 'text', nullable: true })
  personal_details: string;

  @Column({ type: 'datetime' })
  declaration_date: Date;

  @Column()
  signature_name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
