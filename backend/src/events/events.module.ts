import { Module } from "@nestjs/common";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { CommunicationsModule } from "../communications/communications.module.js";
import { DirectorSchoolEventsController, PublicSchoolEventsController } from "./school-events.controller.js";
import { SchoolEventsService } from "./school-events.service.js";
import { SchoolEventRsvpService } from "./school-event-rsvp.service.js";

@Module({ imports: [PrismaModule, CommunicationsModule], controllers: [PublicSchoolEventsController, DirectorSchoolEventsController], providers: [SchoolEventsService, SchoolEventRsvpService, PermissionsGuard], exports: [SchoolEventsService] })
export class EventsModule {}
