import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { memoryStorage } from 'multer';

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (allowed.includes(file.mimetype)) return cb(null, true);
        cb(new BadRequestException('Only JPEG, PNG, WEBP, and PDF files are allowed'), false);
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    const result = await this.uploadService.uploadFile(file.buffer, file.originalname);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      fileExtension: file.originalname.split('.').pop()?.toLowerCase(),
    };
  }

  @Post('delete')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  async deleteUpload(@Body() body: { publicId?: string }) {
    if (!body.publicId) throw new BadRequestException('Upload public ID is required');
    await this.uploadService.deleteFile(body.publicId);
    return { message: 'Upload removed' };
  }
}
