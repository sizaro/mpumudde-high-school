import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { Permissions } from "../common/decorators/permissions.decorator.js";
import { UploadService } from "../upload/upload.service.js";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller("content/media")
export class ContentMediaController {
  constructor(private readonly uploads: UploadService) {}

  @Post("images")
  @Permissions("content.publications.manage", "content.events.manage")
  @UseInterceptors(FileInterceptor("file", {
    storage: memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => {
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      callback(allowed.includes(file.mimetype) ? null : new BadRequestException("Upload a JPEG, PNG, or WEBP image."), allowed.includes(file.mimetype));
    },
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Choose a JPEG, PNG, or WEBP image up to 8 MB.");
    const result = await this.uploads.uploadContentImage(file.buffer, file.originalname);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      mimeType: result.format ? `image/${result.format}` : file.mimetype,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  }
}
