import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum AuditAction {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  PUBLISHED = 'published',
  STATUS_CHANGED = 'status_changed'
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  entity_type: string;

  @Column()
  entity_id: string;

  @Column()
  action: AuditAction;

  @Column({ type: 'json', nullable: true })
  changed_fields: any;

  @Column({ type: 'json', nullable: true })
  old_values: any;

  @Column({ type: 'json', nullable: true })
  new_values: any;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'performed_by' })
  performed_by: User;

  @Column({ nullable: true })
  ip_address: string;

  @Column({ nullable: true })
  user_agent: string;

  @CreateDateColumn()
  created_at: Date;
}
