import { Module } from "@nestjs/common";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { DirectorSchoolEventsController, PublicSchoolEventsController } from "./school-events.controller.js";
import { SchoolEventsService } from "./school-events.service.js";

@Module({ imports: [PrismaModule], controllers: [PublicSchoolEventsController, DirectorSchoolEventsController], providers: [SchoolEventsService, PermissionsGuard], exports: [SchoolEventsService] })
export class EventsModule {}
