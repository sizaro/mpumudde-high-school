import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { UploadModule } from "../upload/upload.module.js";
import { CommunicationsController } from "./communications.controller.js";
import { CommunicationMediaController } from "./communication-media.controller.js";
import { SchoolCommunicationsController } from "./school-communications.controller.js";
import { CommunicationsService } from "./communications.service.js";
import { SchoolEmailService } from "./school-email.service.js";

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [CommunicationsController, SchoolCommunicationsController, CommunicationMediaController],
  providers: [CommunicationsService, SchoolEmailService],
  exports: [CommunicationsService, SchoolEmailService],
})
export class CommunicationsModule {}
