import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Guideline } from './guideline.entity';
import { User } from './user.entity';

@Entity('published_snapshots')
export class PublishedSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Guideline)
  @JoinColumn({ name: 'guideline_id' })
  guideline: Guideline;

  @Column()
  version: string;

  @Column({ type: 'json' })
  snapshot_json: any;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'published_by' })
  published_by: User;

  @CreateDateColumn()
  published_at: Date;

  @Column({ type: 'text', nullable: true })
  changelog: string;
}
