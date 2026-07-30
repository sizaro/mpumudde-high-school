import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TeachingAssignmentsService } from './teaching-assignments.service.js';
import { CreateTeachingAssignmentDto } from './dto/create-teaching-assignment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('teaching-assignments')
export class TeachingAssignmentsController {
  constructor(private readonly service: TeachingAssignmentsService) {}

  @Post()
  create(@Body() dto: CreateTeachingAssignmentDto) { return this.service.create(dto); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get('teacher/:teacherId')
  findByTeacher(@Param('teacherId') teacherId: string) { return this.service.findByTeacher(teacherId); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
