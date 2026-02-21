const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'database', 'entities');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const files = {
    'user.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  GUIDELINE_ADMIN = 'guideline_admin',
  AUTHOR = 'author',
  REVIEWER = 'reviewer'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ nullable: true })
  department: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ nullable: true, unique: true })
  nic_sso_id: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
`,
    'guideline.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

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

  @Column({ type: 'enum', enum: GuidelineStatus, default: GuidelineStatus.DRAFT })
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

  @Column({ type: 'timestamp', nullable: true })
  expiry_date: Date;

  @Column({ default: false })
  is_living: boolean;

  @Column({ default: 'en' })
  language: string;

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
`,
    'guideline-member.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column({ type: 'enum', enum: MemberRole })
  role: MemberRole;

  @Column({ type: 'jsonb', nullable: true })
  assigned_sections: any;

  @Column({ type: 'timestamp', nullable: true })
  invited_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  accepted_at: Date;
}
`,
    'section.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Guideline } from './guideline.entity';
import { User } from './user.entity';

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

  @Index({ type: 'gin' })
  @Column({ type: 'jsonb', nullable: true })
  content_json: any;

  @Column({ type: 'text', nullable: true })
  content_html: string;

  @Column({ default: 'draft' })
  status: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'locked_by' })
  locked_by: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
`,
    'recommendation.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Section } from './section.entity';
import { Guideline } from './guideline.entity';

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

  @Column({ type: 'enum', enum: RecommendationStrength })
  strength: RecommendationStrength;

  @Column({ type: 'enum', enum: RecommendationDirection, nullable: true })
  direction: RecommendationDirection;

  @Column({ type: 'enum', enum: EvidenceLevel, nullable: true })
  evidence_level: EvidenceLevel;

  @Column({ type: 'text', nullable: true })
  certainty_rationale: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ default: 'draft' })
  status: string;

  @Column({ default: '1.0' })
  version: string;

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
`,
    'pico.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Recommendation } from './recommendation.entity';

export enum PicoImportance {
  CRITICAL = 'critical',
  IMPORTANT = 'important',
  NOT_IMPORTANT = 'not_important'
}

@Entity('picos')
export class Pico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Recommendation)
  @JoinColumn({ name: 'recommendation_id' })
  recommendation: Recommendation;

  @Column({ type: 'text' })
  population: string;

  @Column({ type: 'text' })
  intervention: string;

  @Column({ type: 'text' })
  comparator: string;

  @Column({ type: 'text' })
  outcome: string;

  @Column({ type: 'text', nullable: true })
  timeframe: string;

  @Column({ type: 'enum', enum: PicoImportance, default: PicoImportance.IMPORTANT })
  importance: PicoImportance;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
`,
    'evidence-summary.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column({ type: 'enum', enum: EvidenceLevel, nullable: true })
  certainty: EvidenceLevel;

  @Column({ type: 'jsonb', nullable: true })
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
`,
    'reference.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column('text', { array: true })
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

  @Column({ type: 'enum', enum: ReferenceType, default: ReferenceType.OTHER })
  reference_type: ReferenceType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
`,
    'section-reference.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Section } from './section.entity';
import { Reference } from './reference.entity';

@Entity('section_references')
export class SectionReference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Section)
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @ManyToOne(() => Reference)
  @JoinColumn({ name: 'reference_id' })
  reference: Reference;

  @Column({ type: 'int', default: 0 })
  order_index: number;
}
`,
    'audit-log.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column({ type: 'jsonb', nullable: true })
  changed_fields: any;

  @Column({ type: 'jsonb', nullable: true })
  old_values: any;

  @Column({ type: 'jsonb', nullable: true })
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
`,
    'comment.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Guideline } from './guideline.entity';
import { Section } from './section.entity';
import { Recommendation } from './recommendation.entity';
import { User } from './user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Guideline)
  @JoinColumn({ name: 'guideline_id' })
  guideline: Guideline;

  @ManyToOne(() => Section, { nullable: true })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @ManyToOne(() => Recommendation, { nullable: true })
  @JoinColumn({ name: 'recommendation_id' })
  recommendation: Recommendation;

  @ManyToOne(() => Comment, { nullable: true })
  @JoinColumn({ name: 'parent_comment_id' })
  parent_comment: Comment;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  is_resolved: boolean;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'resolved_by' })
  resolved_by: User;

  @Column({ type: 'timestamp', nullable: true })
  resolved_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
`,
    'delphi-round.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column({ type: 'enum', enum: DelphiStatus, default: DelphiStatus.OPEN })
  status: DelphiStatus;

  @Column({ type: 'timestamp', nullable: true })
  opens_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  closes_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
`,
    'delphi-vote.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { DelphiRound } from './delphi-round.entity';
import { Recommendation } from './recommendation.entity';
import { User } from './user.entity';

export enum VoteType {
  STRONGLY_AGREE = 'strongly_agree',
  AGREE = 'agree',
  NEUTRAL = 'neutral',
  DISAGREE = 'disagree',
  STRONGLY_DISAGREE = 'strongly_disagree'
}

@Entity('delphi_votes')
@Unique(['round', 'recommendation', 'voter'])
export class DelphiVote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DelphiRound)
  @JoinColumn({ name: 'round_id' })
  round: DelphiRound;

  @ManyToOne(() => Recommendation)
  @JoinColumn({ name: 'recommendation_id' })
  recommendation: Recommendation;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'voter_id' })
  voter: User;

  @Column({ type: 'enum', enum: VoteType })
  vote: VoteType;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ default: false })
  is_anonymous: boolean;

  @CreateDateColumn()
  created_at: Date;
}
`,
    'coi-declaration.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
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

  @Column({ type: 'timestamp' })
  declaration_date: Date;

  @Column()
  signature_name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
`,
    'published-snapshot.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column({ type: 'jsonb' })
  snapshot_json: any;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'published_by' })
  published_by: User;

  @CreateDateColumn()
  published_at: Date;

  @Column({ type: 'text', nullable: true })
  changelog: string;
}
`,
    'notification.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  COMMENT = 'comment',
  REVIEW = 'review',
  STATUS_CHANGE = 'status_change',
  DELPHI = 'delphi',
  ASSIGNMENT = 'assignment',
  EXPIRY = 'expiry'
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ nullable: true })
  entity_type: string;

  @Column({ nullable: true })
  entity_id: string;

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;
}
`,
    'index.ts': `export * from './user.entity';
export * from './guideline.entity';
export * from './guideline-member.entity';
export * from './section.entity';
export * from './recommendation.entity';
export * from './pico.entity';
export * from './evidence-summary.entity';
export * from './reference.entity';
export * from './section-reference.entity';
export * from './audit-log.entity';
export * from './comment.entity';
export * from './delphi-round.entity';
export * from './delphi-vote.entity';
export * from './coi-declaration.entity';
export * from './published-snapshot.entity';
export * from './notification.entity';
`
};

for (const [filename, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, filename), content);
    console.log('Created: ' + filename);
}
