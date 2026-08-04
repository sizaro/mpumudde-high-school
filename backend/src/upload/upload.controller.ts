import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
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

  @Get('view')
  async viewUpload(
    @Query('url') url: string,
    @Query('fileName') fileName: string | undefined,
    @Res() response: Response,
  ) {
    if (!url) throw new BadRequestException('Upload URL is required');
    const parsed = new URL(url);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    if (
      parsed.protocol !== 'https:' ||
      parsed.hostname !== 'res.cloudinary.com' ||
      !cloudName ||
      !parsed.pathname.startsWith(`/${cloudName}/`)
    ) {
      throw new BadRequestException(
        'Only this school Cloudinary account can be viewed',
      );
    }
    const upstream = await fetch(parsed.toString());
    if (!upstream.ok) {
      throw new BadRequestException('The uploaded proof could not be opened');
    }
    const bytes = Buffer.from(await upstream.arrayBuffer());
    const safeName = (
      fileName ||
      parsed.pathname.split('/').pop() ||
      'payment-proof'
    ).replace(/[^a-zA-Z0-9._-]/g, '_');
    const lowerName = safeName.toLowerCase();
    const contentType = lowerName.endsWith('.pdf')
      ? 'application/pdf'
      : lowerName.endsWith('.png')
        ? 'image/png'
        : lowerName.endsWith('.webp')
          ? 'image/webp'
          : lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')
            ? 'image/jpeg'
            : upstream.headers.get('content-type') ||
              'application/octet-stream';
    response.setHeader('Content-Type', contentType);
    response.setHeader('Content-Disposition', `inline; filename="${safeName}"`);
    response.setHeader('Content-Length', bytes.length.toString());
    response.send(bytes);
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
