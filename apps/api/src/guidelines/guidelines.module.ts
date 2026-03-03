import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { GuidelinesService } from './guidelines.service';
import { GuidelinesController } from './guidelines.controller';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { DocumentUploadService } from './document-upload.service';
import { EvidenceService } from './evidence.service';
import { EvidenceController } from './evidence.controller';
import { ReferencesService } from './references.service';
import { ReferencesController } from './references.controller';
import { Guideline } from '../database/entities/guideline.entity';
import { Section } from '../database/entities/section.entity';
import { Recommendation } from '../database/entities/recommendation.entity';
import { Pico } from '../database/entities/pico.entity';
import { EvidenceSummary } from '../database/entities/evidence-summary.entity';
import { Reference } from '../database/entities/reference.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Guideline, Section, Recommendation, Pico, EvidenceSummary, Reference]),
        MulterModule.register({
            limits: { fileSize: 100 * 1024 * 1024 },
        }),
    ],
    controllers: [GuidelinesController, SectionsController, EvidenceController, ReferencesController],
    providers: [GuidelinesService, SectionsService, DocumentUploadService, EvidenceService, ReferencesService],
    exports: [GuidelinesService],
})
export class GuidelinesModule { }
