import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service.js';
import { CreateClassDto } from './dto/create-class.dto.js';
import { UpdateClassDto } from './dto/update-class.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(@Body() dto: CreateClassDto) { return this.classesService.create(dto); }

  @Get()
  findAll() { return this.classesService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.classesService.findOne(id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClassDto) { return this.classesService.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.classesService.remove(id); }
}
