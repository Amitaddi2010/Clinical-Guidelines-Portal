import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Guideline } from './guideline.entity';

export enum DelphiStatus {
  OPEN = 'open',
  CLOSED = 'closed'
}

@Entity('delphi_rounds')
export class DelphiRound {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Guideline)
  @JoinColumn({ name: 'guideline_id' })
  guideline: Guideline;

  @Column({ type: 'int' })
  round_number: number;

  @Column()
  title: string;

  @Column({ default: DelphiStatus.OPEN })
  status: DelphiStatus;

  @Column({ type: 'datetime', nullable: true })
  opens_at: Date;

  @Column({ type: 'datetime', nullable: true })
  closes_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
