import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AttendanceService } from "./attendance.service.js";
import { CreateAttendanceSessionDto } from "./dto/create-attendance-session.dto.js";
import { BulkUpdateAttendanceRecordsDto } from "./dto/bulk-update-attendance-records.dto.js";
import { UpdateAttendanceRecordDto } from "./dto/update-attendance-record.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("TEACHER", "SUPER_ADMIN")
@Controller("attendance")
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post("sessions")
  createSession(@Body() dto: CreateAttendanceSessionDto, @Req() req: any) {
    return this.attendanceService.createSession(dto, req.user.id);
  }

  @Get("sessions")
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get("sessions/mine")
  findMine(@Req() req: any) {
    return this.attendanceService.findByTeacher(req.user.id);
  }

  @Get("sessions/class/:classId")
  findByClass(@Param("classId") classId: string) {
    return this.attendanceService.findByClass(classId);
  }

  @Get("sessions/:id")
  findOne(@Param("id") id: string) {
    return this.attendanceService.findOne(id);
  }

  @Get("students/class/:classId")
  getStudentsForClass(@Param("classId") classId: string) {
    return this.attendanceService.getStudentsForClass(classId);
  }

  @Patch("sessions/:sessionId/records/:recordId")
  @Roles("SUPER_ADMIN")
  updateRecordStatus(
    @Param("sessionId") sessionId: string,
    @Param("recordId") recordId: string,
    @Body() dto: UpdateAttendanceRecordDto,
  ) {
    return this.attendanceService.updateRecordStatus(
      sessionId,
      recordId,
      dto.status,
    );
  }

  @Patch("sessions/:sessionId/records")
  @Roles("SUPER_ADMIN")
  updateManyRecordStatuses(
    @Param("sessionId") sessionId: string,
    @Body() dto: BulkUpdateAttendanceRecordsDto,
  ) {
    return this.attendanceService.updateManyRecordStatuses(
      sessionId,
      dto.records,
    );
  }
}
