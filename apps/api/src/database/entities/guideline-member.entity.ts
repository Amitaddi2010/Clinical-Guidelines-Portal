import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Guideline } from './guideline.entity';
import { User } from './user.entity';

export enum MemberRole {
  ADMIN = 'admin',
  AUTHOR = 'author',
  REVIEWER = 'reviewer',
  VIEWER = 'viewer'
}

@Entity('guideline_members')
export class GuidelineMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Guideline)
  @JoinColumn({ name: 'guideline_id' })
  guideline: Guideline;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  role: MemberRole;

  @Column({ type: 'json', nullable: true })
  assigned_sections: any;

  @Column({ type: 'datetime', nullable: true })
  invited_at: Date;

  @Column({ type: 'datetime', nullable: true })
  accepted_at: Date;
}
