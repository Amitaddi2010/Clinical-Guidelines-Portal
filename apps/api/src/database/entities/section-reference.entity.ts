import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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
