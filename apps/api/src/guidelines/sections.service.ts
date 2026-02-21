import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from '../database/entities/section.entity';
import { Guideline } from '../database/entities/guideline.entity';
import { Recommendation } from '../database/entities/recommendation.entity';

@Injectable()
export class SectionsService {
    constructor(
        @InjectRepository(Section)
        private sectionRepository: Repository<Section>,
        @InjectRepository(Guideline)
        private guidelineRepository: Repository<Guideline>,
        @InjectRepository(Recommendation)
        private recommendationRepository: Repository<Recommendation>,
    ) { }

    async createSection(guidelineId: string, title: string, order_index: number): Promise<Section> {
        const guideline = await this.guidelineRepository.findOne({ where: { id: guidelineId } });
        if (!guideline) throw new NotFoundException('Guideline not found');

        const section = this.sectionRepository.create({
            title,
            order_index,
            guideline,
        });
        return this.sectionRepository.save(section);
    }

    async updateSectionContent(sectionId: string, content_html: string): Promise<Section> {
        const section = await this.sectionRepository.findOne({ where: { id: sectionId } });
        if (!section) throw new NotFoundException('Section not found');

        section.content_html = content_html;
        return this.sectionRepository.save(section);
    }

    async createRecommendation(sectionId: string, text: string): Promise<Recommendation> {
        const section = await this.sectionRepository.findOne({ where: { id: sectionId } });
        if (!section) throw new NotFoundException('Section not found');

        const rec = this.recommendationRepository.create({
            text,
            order_index: 0,
            section,
        });
        return this.recommendationRepository.save(rec);
    }
}
