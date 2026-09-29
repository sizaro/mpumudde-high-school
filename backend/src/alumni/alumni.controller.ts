import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { StartAlumniRegistrationDto } from "./dto/start-alumni-registration.dto.js";
import { CompleteAlumniRegistrationDto } from "./dto/complete-alumni-registration.dto.js";
import { AlumniService } from "./alumni.service.js";

@Controller("alumni")
export class AlumniController {
  constructor(private readonly alumniService: AlumniService) {}

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
}
