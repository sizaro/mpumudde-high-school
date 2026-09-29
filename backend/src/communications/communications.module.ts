import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { CommunicationsController } from "./communications.controller.js";
import { SchoolCommunicationsController } from "./school-communications.controller.js";
import { CommunicationsService } from "./communications.service.js";
import { SchoolEmailService } from "./school-email.service.js";

@Module({
  imports: [PrismaModule],
  controllers: [CommunicationsController, SchoolCommunicationsController],
  providers: [CommunicationsService, SchoolEmailService],
  exports: [CommunicationsService, SchoolEmailService],
})
export class CommunicationsModule {}
