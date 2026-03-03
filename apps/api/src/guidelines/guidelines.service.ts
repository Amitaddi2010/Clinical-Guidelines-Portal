import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guideline, GuidelineStatus } from '../database/entities/guideline.entity';
import { Section } from '../database/entities/section.entity';
import { User } from '../database/entities/user.entity';
import { DocumentUploadService } from './document-upload.service';

@Injectable()
export class GuidelinesService {
    constructor(
        @InjectRepository(Guideline)
        private guidelinesRepository: Repository<Guideline>,
        @InjectRepository(Section)
        private sectionsRepository: Repository<Section>,
        private documentUploadService: DocumentUploadService,
    ) { }

    async findAll(status?: GuidelineStatus): Promise<Guideline[]> {
        const query = this.guidelinesRepository.createQueryBuilder('guideline')
            // Remove the automatic heavy join to sections
            .orderBy('guideline.published_at', 'DESC')
            .addOrderBy('guideline.created_at', 'DESC');

        if (status) {
            query.where('guideline.status = :status', { status });
        }

        return query.getMany();
    }

    async findOne(id: string): Promise<Guideline> {
        const guideline = await this.guidelinesRepository.findOne({
            where: { id },
            relations: ['sections', 'sections.recommendations', 'sections.recommendations.picos', 'sections.recommendations.picos.evidence_summaries', 'sections.recommendations.references'],
        });
        if (!guideline) {
            throw new NotFoundException(`Guideline with ID ${id} not found`);
        }
        return guideline;
    }

    async create(createData: Partial<Guideline>, user: User | null): Promise<Guideline> {
        const guideline = this.guidelinesRepository.create({
            ...createData,
            icmr_ref_no: createData.icmr_ref_no || `ICMR-${Date.now()}`,
            status: GuidelineStatus.DRAFT,
        });
        return this.guidelinesRepository.save(guideline);
    }

    async createFromDocument(file: any, user: User | null, title?: string, department?: string): Promise<Guideline> {
        const extracted = await this.documentUploadService.processDocument(file);

        const guideline = this.guidelinesRepository.create({
            title: title || file.originalname.replace(/\.[^/.]+$/, ''),
            description: extracted.text.substring(0, 500) + (extracted.text.length > 500 ? '...' : ''),
            department: department || 'General',
            icmr_ref_no: `ICMR-${Date.now()}`,
            status: GuidelineStatus.DRAFT,
        });

        const savedGuideline = await this.guidelinesRepository.save(guideline);

        // Create sections from parsed document headings
        if (extracted.sections && extracted.sections.length > 0) {
            for (const sec of extracted.sections) {
                const section = this.sectionsRepository.create({
                    guideline: savedGuideline,
                    title: sec.title,
                    content_html: sec.content_html,
                    order_index: sec.order_index,
                    status: 'draft'
                });
                await this.sectionsRepository.save(section);
            }
        } else {
            // Fallback: single section with all content
            const section = this.sectionsRepository.create({
                guideline: savedGuideline,
                title: 'Document Content',
                content_html: extracted.html || `<p>${extracted.text}</p>`,
                order_index: 0,
                status: 'draft'
            });
            await this.sectionsRepository.save(section);
        }

        return savedGuideline;
    }

    async update(id: string, updateData: Partial<Guideline>, user: User): Promise<Guideline> {
        // Use a simple find without loading nested relations to avoid cascade save issues
        const guideline = await this.guidelinesRepository.findOne({ where: { id } });
        if (!guideline) {
            throw new NotFoundException(`Guideline with ID ${id} not found`);
        }
        this.guidelinesRepository.merge(guideline, updateData);
        return this.guidelinesRepository.save(guideline);
    }

    async remove(id: string): Promise<{ deleted: boolean }> {
        const guideline = await this.findOne(id);
        // Delete sections first
        await this.sectionsRepository.delete({ guideline: { id } });
        await this.guidelinesRepository.remove(guideline);
        return { deleted: true };
    }
}
