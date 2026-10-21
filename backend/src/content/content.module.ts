import { Module } from "@nestjs/common";
import { UploadModule } from "../upload/upload.module.js";
import { ContentMediaController } from "./content-media.controller.js";

@Module({
  imports: [UploadModule],
  controllers: [ContentMediaController],
})
export class ContentModule {}
