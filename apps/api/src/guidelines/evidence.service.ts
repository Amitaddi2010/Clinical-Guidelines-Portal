import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pico } from '../database/entities/pico.entity';
import { EvidenceSummary } from '../database/entities/evidence-summary.entity';
import { Recommendation } from '../database/entities/recommendation.entity';

@Injectable()
export class EvidenceService {
    constructor(
        @InjectRepository(Pico)
        private picoRepository: Repository<Pico>,
        @InjectRepository(EvidenceSummary)
        private evidenceSummaryRepository: Repository<EvidenceSummary>,
        @InjectRepository(Recommendation)
        private recommendationRepository: Repository<Recommendation>,
    ) { }

    async createPico(recommendationId: string, picoData: Partial<Pico>): Promise<Pico> {
        const rec = await this.recommendationRepository.findOne({ where: { id: recommendationId } });
        if (!rec) throw new NotFoundException('Recommendation not found');

        const newPico = this.picoRepository.create({
            ...picoData,
            recommendation: rec,
        });
        return this.picoRepository.save(newPico);
    }

    async updatePico(id: string, updateData: Partial<Pico>): Promise<Pico> {
        const pico = await this.picoRepository.findOne({ where: { id } });
        if (!pico) throw new NotFoundException('PICO not found');

        Object.assign(pico, updateData);
        return this.picoRepository.save(pico);
    }

    async deletePico(id: string): Promise<void> {
        const pico = await this.picoRepository.findOne({ where: { id } });
        if (!pico) throw new NotFoundException('PICO not found');
        await this.picoRepository.remove(pico);
    }

    async createEvidenceSummary(picoId: string, data: Partial<EvidenceSummary>): Promise<EvidenceSummary> {
        const pico = await this.picoRepository.findOne({ where: { id: picoId } });
        if (!pico) throw new NotFoundException('PICO not found');

        const summary = this.evidenceSummaryRepository.create({
            ...data,
            pico,
        });
        return this.evidenceSummaryRepository.save(summary);
    }

    async updateEvidenceSummary(id: string, updateData: Partial<EvidenceSummary>): Promise<EvidenceSummary> {
        const summary = await this.evidenceSummaryRepository.findOne({ where: { id } });
        if (!summary) throw new NotFoundException('Evidence Summary not found');

        Object.assign(summary, updateData);
        return this.evidenceSummaryRepository.save(summary);
    }

    async deleteEvidenceSummary(id: string): Promise<void> {
        const summary = await this.evidenceSummaryRepository.findOne({ where: { id } });
        if (!summary) throw new NotFoundException('Evidence Summary not found');
        await this.evidenceSummaryRepository.remove(summary);
    }
}
