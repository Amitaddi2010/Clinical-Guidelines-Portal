import { Controller, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('guidelines/:guidelineId/sections')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.GUIDELINE_ADMIN, UserRole.AUTHOR)
export class SectionsController {
    constructor(private readonly sectionsService: SectionsService) { }

    @Post()
    async createSection(
        @Param('guidelineId') guidelineId: string,
        @Body('title') title: string,
        @Body('order_index') order_index: number,
    ) {
        return this.sectionsService.createSection(guidelineId, title, order_index);
    }

    @Put(':sectionId/content')
    async updateContent(
        @Param('sectionId') sectionId: string,
        @Body('content_html') content_html: string,
    ) {
        return this.sectionsService.updateSectionContent(sectionId, content_html);
    }

    @Post(':sectionId/recommendations')
    async createRecommendation(
        @Param('sectionId') sectionId: string,
        @Body('text') text: string,
    ) {
        return this.sectionsService.createRecommendation(sectionId, text);
    }
}
