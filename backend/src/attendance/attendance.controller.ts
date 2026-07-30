import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service.js';
import { CreateAttendanceSessionDto } from './dto/create-attendance-session.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('sessions')
  createSession(@Body() dto: CreateAttendanceSessionDto, @Req() req: any) {
    return this.attendanceService.createSession(dto, req.user.id);
  }

  @Get('sessions')
  findAll() { return this.attendanceService.findAll(); }

  @Get('sessions/mine')
  findMine(@Req() req: any) { return this.attendanceService.findByTeacher(req.user.id); }

  @Get('sessions/class/:classId')
  findByClass(@Param('classId') classId: string) { return this.attendanceService.findByClass(classId); }

  @Get('sessions/:id')
  findOne(@Param('id') id: string) { return this.attendanceService.findOne(id); }

  @Get('students/class/:classId')
  getStudentsForClass(@Param('classId') classId: string) {
    return this.attendanceService.getStudentsForClass(classId);
  }
}
