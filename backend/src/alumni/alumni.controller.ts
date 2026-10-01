import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { StartAlumniRegistrationDto } from "./dto/start-alumni-registration.dto.js";
import { CompleteAlumniRegistrationDto } from "./dto/complete-alumni-registration.dto.js";
import { AlumniService } from "./alumni.service.js";
import type {
  UpdateAlumniData,
  UpdateAlumniStatusData,
} from "./alumni.service.js";

@Controller("alumni")
export class AlumniController {
  constructor(private readonly alumniService: AlumniService) {}

  // ============================================================
  // PUBLIC ALUMNI REGISTRATION
  // ============================================================

  @Post("registration/start")
  startRegistration(@Body() dto: StartAlumniRegistrationDto) {
    return this.alumniService.startRegistration(dto.email);
  }

  @Get("registration/verify")
  verifyRegistration(@Query("token") token?: string) {
    if (!token?.trim()) {
      throw new BadRequestException("Verification token is required.");
    }

    return this.alumniService.verifyRegistrationToken(token.trim());
  }

  @Post("registration/complete")
  @UseInterceptors(
    FileInterceptor("profileImage", {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  completeRegistration(
    @Body() dto: CompleteAlumniRegistrationDto,
    @UploadedFile() profileImage?: Express.Multer.File,
  ) {
    return this.alumniService.completeRegistration(dto, profileImage);
  }

  // ============================================================
  // DIRECTOR ALUMNI MANAGEMENT
  // ============================================================

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  findAll() {
    return this.alumniService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  findOne(@Param("id") id: string) {
    return this.alumniService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  update(@Param("id") id: string, @Body() data: UpdateAlumniData) {
    return this.alumniService.update(id, data);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  updateStatus(@Param("id") id: string, @Body() data: UpdateAlumniStatusData) {
    return this.alumniService.updateStatus(id, data);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  remove(@Param("id") id: string) {
    return this.alumniService.remove(id);
  }
}
