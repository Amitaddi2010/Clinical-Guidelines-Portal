import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ReferencesService } from './references.service';

@Controller('guidelines/:guidelineId/references')
export class ReferencesController {
    constructor(private readonly referencesService: ReferencesService) { }

    @Get()
    async getReferences(@Param('guidelineId') guidelineId: string) {
        return this.referencesService.getReferencesByGuideline(guidelineId);
    }

    @Post()
    async createReference(
        @Param('guidelineId') guidelineId: string,
        @Body() refData: any,
    ) {
        return this.referencesService.createReference(guidelineId, refData);
    }

    @Put(':id')
    async updateReference(
        @Param('id') id: string,
        @Body() updateData: any,
    ) {
        return this.referencesService.updateReference(id, updateData);
    }

    @Delete(':id')
    async deleteReference(@Param('id') id: string) {
        return this.referencesService.deleteReference(id);
    }
}
