import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req, Query, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GuidelinesService } from './guidelines.service';
import { DocumentUploadService } from './document-upload.service';
import { Guideline, GuidelineStatus } from '../database/entities/guideline.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('guidelines')
export class GuidelinesController {
    constructor(
        private readonly guidelinesService: GuidelinesService,
        private readonly documentUploadService: DocumentUploadService
    ) { }

    @Get('test')
    async test() {
        return { message: 'Guidelines API is working', timestamp: new Date().toISOString() };
    }

    @Get('debug-sync')
    async debugSync() {
        try {
            const { dataSourceOptions } = require('../database/data-source');
            const { DataSource } = require('typeorm');
            const ds = new DataSource(dataSourceOptions);
            await ds.initialize();
            await ds.synchronize(); // Force schema creation
            await ds.destroy();
            return { message: 'Database tables synchronized successfully!' };
        } catch (error) {
            return { error: error.message, stack: error.stack };
        }
    }

    @Get()
    async findAll(@Query('status') status?: GuidelineStatus) {
        try {
            return await this.guidelinesService.findAll(status);
        } catch (error) {
            console.error('Error in findAll:', error);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message || error.toString(),
                stack: error.stack
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.guidelinesService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.GUIDELINE_ADMIN, UserRole.AUTHOR)
    async create(@Body() createData: Partial<Guideline>, @Req() req: any) {
        return this.guidelinesService.create(createData, req.user);
    }

    @Post('create-from-document')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.GUIDELINE_ADMIN, UserRole.AUTHOR)
    @UseInterceptors(FileInterceptor('file', {
        limits: { fileSize: 100 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/pdf',
                'text/html'
            ];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Only DOCX, PDF, and HTML files are allowed'), false);
            }
        }
    }))
    async createFromDocument(
        @UploadedFile() file: any,
        @Body('title') title: string,
        @Body('department') department: string,
        @Req() req: any
    ) {
        if (!file) {
            throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
        }

        try {
            const guideline = await this.guidelinesService.createFromDocument(file, req.user, title, department);

            return {
                success: true,
                id: guideline.id,
                title: guideline.title,
                message: 'Guideline created successfully from document'
            };
        } catch (error) {
            console.error('Upload error:', error);
            throw new HttpException('Failed to process document', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.GUIDELINE_ADMIN, UserRole.AUTHOR)
    async update(@Param('id') id: string, @Body() updateData: Partial<Guideline>, @Req() req: any) {
        try {
            console.log(`Updating guideline ${id} with data:`, JSON.stringify(updateData));
            const result = await this.guidelinesService.update(id, updateData, req.user);
            console.log(`Guideline ${id} updated successfully`);
            return result;
        } catch (error) {
            console.error('Error updating guideline:', error);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message || error.toString(),
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.guidelinesService.remove(id);
    }

    @Post('upload')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.GUIDELINE_ADMIN, UserRole.AUTHOR)
    @UseInterceptors(FileInterceptor('file', {
        limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
        fileFilter: (req, file, cb) => {
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/pdf',
                'text/html'
            ];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Only DOCX, PDF, and HTML files are allowed'), false);
            }
        }
    }))
    async uploadDocument(@UploadedFile() file: any) {
        if (!file) {
            throw new Error('No file uploaded');
        }

        const result = await this.documentUploadService.processDocument(file);

        return {
            success: true,
            data: {
                text: result.text,
                html: result.html,
                imageCount: result.images.length,
                images: result.images.map(img => ({
                    filename: img.filename,
                    contentType: img.contentType,
                    size: img.data.length
                }))
            }
        };
    }

    @Post('upload/images')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.GUIDELINE_ADMIN, UserRole.AUTHOR)
    @UseInterceptors(FileInterceptor('file', {
        limits: { fileSize: 100 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/pdf',
                'text/html'
            ];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Only DOCX, PDF, and HTML files are allowed'), false);
            }
        }
    }))
    async uploadDocumentWithImages(@UploadedFile() file: any) {
        if (!file) {
            throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
        }

        const result = await this.documentUploadService.processDocument(file);

        return {
            success: true,
            data: {
                text: result.text,
                html: result.html,
                images: result.images.map(img => ({
                    filename: img.filename,
                    contentType: img.contentType,
                    size: img.data.length,
                    base64: img.data.toString('base64')
                }))
            }
        };
    }
}
