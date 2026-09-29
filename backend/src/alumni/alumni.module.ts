import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { NotificationsModule } from "../notifications/notifications.module.js";
import { CommunicationsModule } from "../communications/communications.module.js";
import { UploadModule } from "../upload/upload.module.js";
import { AlumniController } from "./alumni.controller.js";
import { AlumniService } from "./alumni.service.js";

@Module({
  imports: [
    PrismaModule,
    NotificationsModule,
    CommunicationsModule,
    UploadModule,
  ],
  controllers: [AlumniController],
  providers: [AlumniService],
  exports: [AlumniService],
})
export class AlumniModule {}
