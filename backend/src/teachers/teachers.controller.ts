import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeachersService } from './teachers.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CreateTeacherDto } from './dto/create-teacher.dto.js';
import { UpdateTeacherDto } from './dto/update-teacher.dto.js';
import { CreateEmploymentDto } from './dto/create-employment.dto.js';
import { CreateTeacherAccountDto } from './dto/create-account.dto.js';
import { CreateEmergencyContactDto } from './dto/create-emergency-contact.dto.js';
import { UpdateEmergencyContactDto } from './dto/update-emergency-contact.dto.js';
import { CreateMedicalInfoDto } from './dto/create-medical-info.dto.js';
import { CreateQualificationDto } from './dto/create-qualification.dto.js';
import { UpdateQualificationDto } from './dto/update-qualification.dto.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  // --- Teacher: own endpoints (must come before :id routes) ----------
  @Get('me/profile')
  getMyProfile(@Req() req: any) {
    return this.teachersService.getMyProfile(req.user.id);
  }

  @Get('me/classes')
  getMyClasses(@Req() req: any) {
    return this.teachersService.getMyClasses(req.user.id);
  }

  @Get('me/subjects')
  getMySubjects(@Req() req: any) {
    return this.teachersService.getMySubjects(req.user.id);
  }

  @Get('me/assignments')
  getMyAssignments(@Req() req: any) {
    return this.teachersService.getMyAssignments(req.user.id);
  }

  // --- Director: CRUD -------------------------------------------------
  @Post()
  createWithAccount(
    @Body()
    body: { personal: CreateTeacherDto; account: CreateTeacherAccountDto },
  ) {
    return this.teachersService.createWithAccount(body.personal, body.account);
  }

  @Get()
  findAll() {
    return this.teachersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(id);
  }

  @Patch(':id/personal')
  updatePersonal(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    return this.teachersService.updatePersonal(id, dto);
  }

  @Put(':id/employment')
  upsertEmployment(
    @Param('id') id: string,
    @Body() dto: CreateEmploymentDto,
  ) {
    return this.teachersService.upsertEmployment(id, dto);
  }

  @Put(':id/medical')
  upsertMedical(
    @Param('id') id: string,
    @Body() dto: CreateMedicalInfoDto,
  ) {
    return this.teachersService.upsertMedicalInfo(id, dto);
  }

  // --- Emergency Contacts ----------------------------------------------
  @Post(':id/contacts')
  addContact(
    @Param('id') id: string,
    @Body() dto: CreateEmergencyContactDto,
  ) {
    return this.teachersService.addEmergencyContact(id, dto);
  }

  @Patch(':id/contacts/:contactId')
  updateContact(
    @Param('contactId') contactId: string,
    @Body() dto: UpdateEmergencyContactDto,
  ) {
    return this.teachersService.updateEmergencyContact(contactId, dto);
  }

  @Delete(':id/contacts/:contactId')
  removeContact(@Param('contactId') contactId: string) {
    return this.teachersService.removeEmergencyContact(contactId);
  }

  // --- Qualifications --------------------------------------------------
  @Post(':id/qualifications')
  addQualification(
    @Param('id') id: string,
    @Body() dto: CreateQualificationDto,
  ) {
    return this.teachersService.addQualification(id, dto);
  }

  @Patch(':id/qualifications/:qualId')
  updateQualification(
    @Param('qualId') qualId: string,
    @Body() dto: UpdateQualificationDto,
  ) {
    return this.teachersService.updateQualification(qualId, dto);
  }

  @Delete(':id/qualifications/:qualId')
  removeQualification(@Param('qualId') qualId: string) {
    return this.teachersService.removeQualification(qualId);
  }

  // --- Documents -------------------------------------------------------
  @Get(':id/documents')
  getDocuments(@Param('id') id: string) {
    return this.teachersService.getDocuments(id);
  }

  @Post(':id/documents')
  addDocument(
    @Param('id') id: string,
    @Body() dto: CreateDocumentDto,
    @Req() req: any,
  ) {
    return this.teachersService.addDocument(id, dto, req.user.id);
  }

  @Delete(':id/documents/:docId')
  removeDocument(@Param('docId') docId: string) {
    return this.teachersService.removeDocument(docId);
  }

  // --- Status ----------------------------------------------------------
  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.teachersService.deactivate(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachersService.remove(id);
  }
}
