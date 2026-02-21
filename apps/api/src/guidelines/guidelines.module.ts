import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { GuidelinesService } from './guidelines.service';
import { GuidelinesController } from './guidelines.controller';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { DocumentUploadService } from './document-upload.service';
import { Guideline } from '../database/entities/guideline.entity';
import { Section } from '../database/entities/section.entity';
import { Recommendation } from '../database/entities/recommendation.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Guideline, Section, Recommendation]),
        MulterModule.register({
            limits: { fileSize: 100 * 1024 * 1024 },
        }),
    ],
    controllers: [GuidelinesController, SectionsController],
    providers: [GuidelinesService, SectionsService, DocumentUploadService],
    exports: [GuidelinesService],
})
export class GuidelinesModule { }
