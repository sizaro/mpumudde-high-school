import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { LinkParentDto } from './dto/link-parent.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { CompleteStudentRegistrationDto } from './dto/complete-student-registration.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Post('complete-registration')
  async createComplete(@Body() dto: CompleteStudentRegistrationDto, @CurrentUser() user: { id?: string }) {
    return this.studentsService.createCompleteRegistration(dto, user);
  }

  @Get()
  async findAll(@Query('includeInactive') includeInactive?: string) {
    return this.studentsService.findAll(includeInactive === 'true');
  }

  @Get('promotion/candidates')
  getPromotionCandidates(
    @Query('academicYearId') academicYearId: string,
    @Query('classId') classId: string,
  ) {
    return this.studentsService.getPromotionCandidates(academicYearId, classId);
  }

  @Post('promotion/process')
  processPromotion(@Body() body: any) {
    return this.studentsService.processPromotion(body);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Get(':id/finance-summary')
  async getFinanceSummary(@Param('id') id: string) {
    return this.studentsService.getFinanceSummary(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Post(':id/link-parent')
  async linkParent(@Param('id') id: string, @Body() linkParentDto: LinkParentDto) {
    return this.studentsService.linkParent(id, linkParentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
