import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reference } from '../database/entities/reference.entity';
import { Guideline } from '../database/entities/guideline.entity';

@Injectable()
export class ReferencesService {
    constructor(
        @InjectRepository(Reference)
        private referenceRepository: Repository<Reference>,
        @InjectRepository(Guideline)
        private guidelineRepository: Repository<Guideline>,
    ) { }

    async getReferencesByGuideline(guidelineId: string): Promise<Reference[]> {
        return this.referenceRepository.find({
            where: { guideline: { id: guidelineId } },
            order: { created_at: 'DESC' }
        });
    }

    async createReference(guidelineId: string, refData: Partial<Reference>): Promise<Reference> {
        const guideline = await this.guidelineRepository.findOne({ where: { id: guidelineId } });
        if (!guideline) throw new NotFoundException('Guideline not found');

        const reference = this.referenceRepository.create({
            ...refData,
            guideline,
        });
        return this.referenceRepository.save(reference);
    }

    async updateReference(id: string, updateData: Partial<Reference>): Promise<Reference> {
        const reference = await this.referenceRepository.findOne({ where: { id } });
        if (!reference) throw new NotFoundException('Reference not found');

        Object.assign(reference, updateData);
        return this.referenceRepository.save(reference);
    }

    async deleteReference(id: string): Promise<void> {
        const reference = await this.referenceRepository.findOne({ where: { id } });
        if (!reference) throw new NotFoundException('Reference not found');
        await this.referenceRepository.remove(reference);
    }
}
