import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SubjectsService } from './subjects.service.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(@Body() dto: CreateSubjectDto) { return this.subjectsService.create(dto); }

  @Get()
  findAll() { return this.subjectsService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.subjectsService.findOne(id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubjectDto) { return this.subjectsService.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.subjectsService.remove(id); }
}
