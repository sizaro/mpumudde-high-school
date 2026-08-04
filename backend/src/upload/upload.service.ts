import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME')?.trim(),
      api_key: config.get<string>('CLOUDINARY_API_KEY')?.trim(),
      api_secret: config.get<string>('CLOUDINARY_API_SECRET')?.trim(),
    });
  }

  async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    folder = 'school-uploads',
  ): Promise<UploadApiResponse> {
    const resourceType = originalName.toLowerCase().endsWith('.pdf') ? 'raw' : 'image';
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: resourceType, use_filename: true, unique_filename: true },
        (error, result) => {
          if (error || !result) return reject(error ?? new BadRequestException('Upload failed'));
          resolve(result);
        },
      );
      uploadStream.end(fileBuffer);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
