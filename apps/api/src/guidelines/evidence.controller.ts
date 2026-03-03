import { Controller, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { EvidenceService } from './evidence.service';

@Controller('evidence')
export class EvidenceController {
    constructor(private readonly evidenceService: EvidenceService) { }

    // PICO Routes
    @Post('recommendations/:recommendationId/picos')
    async createPico(
        @Param('recommendationId') recommendationId: string,
        @Body() picoData: any,
    ) {
        return this.evidenceService.createPico(recommendationId, picoData);
    }

    @Put('picos/:picoId')
    async updatePico(
        @Param('picoId') picoId: string,
        @Body() updateData: any,
    ) {
        return this.evidenceService.updatePico(picoId, updateData);
    }

    @Delete('picos/:picoId')
    async deletePico(@Param('picoId') picoId: string) {
        return this.evidenceService.deletePico(picoId);
    }

    // Evidence Summary Routes
    @Post('picos/:picoId/evidence-summaries')
    async createEvidenceSummary(
        @Param('picoId') picoId: string,
        @Body() summaryData: any,
    ) {
        return this.evidenceService.createEvidenceSummary(picoId, summaryData);
    }

    @Put('evidence-summaries/:summaryId')
    async updateEvidenceSummary(
        @Param('summaryId') summaryId: string,
        @Body() updateData: any,
    ) {
        return this.evidenceService.updateEvidenceSummary(summaryId, updateData);
    }

    @Delete('evidence-summaries/:summaryId')
    async deleteEvidenceSummary(@Param('summaryId') summaryId: string) {
        return this.evidenceService.deleteEvidenceSummary(summaryId);
    }
}
