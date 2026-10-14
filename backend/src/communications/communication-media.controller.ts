import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { UploadService } from "../upload/upload.service.js";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("SUPER_ADMIN")
@Controller("communications/media")
export class CommunicationMediaController {
  constructor(private readonly uploads: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file", {
    storage: memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => {
      const allowed = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm", "video/quicktime"];
      callback(allowed.includes(file.mimetype) ? null : new BadRequestException("Upload a JPEG, PNG, WEBP, MP4, WEBM, or MOV file."), allowed.includes(file.mimetype));
    },
  }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Choose an image or video to upload.");
    const result = await this.uploads.uploadCommunicationAsset(file.buffer, file.originalname, file.mimetype);
    return { url: result.secure_url, publicId: result.public_id, mimeType: file.mimetype, fileSize: file.size, resourceType: file.mimetype.startsWith("video/") ? "VIDEO" : "IMAGE" };
  }
}
