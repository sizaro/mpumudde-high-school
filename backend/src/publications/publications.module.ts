import { Module } from "@nestjs/common";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { DirectorSchoolPublicationsController, PublicSchoolPublicationsController } from "./school-publications.controller.js";
import { SchoolPublicationsService } from "./school-publications.service.js";

@Module({ imports: [PrismaModule], controllers: [PublicSchoolPublicationsController, DirectorSchoolPublicationsController], providers: [SchoolPublicationsService, PermissionsGuard], exports: [SchoolPublicationsService] })
export class PublicationsModule {}
