import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SetupService } from './setup.service.js';

@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @Get('academic-years')
  listAcademicYears() {
    return this.setupService.listAcademicYears();
  }

  @Post('academic-years')
  createAcademicYear(@Body() body: any) {
    return this.setupService.createAcademicYear(body);
  }

  @Patch('academic-years/:id')
  updateAcademicYear(@Param('id') id: string, @Body() body: any) {
    return this.setupService.updateAcademicYear(id, body);
  }

  @Get('terms')
  listTerms() {
    return this.setupService.listTerms();
  }

  @Post('terms')
  createTerm(@Body() body: any) {
    return this.setupService.createTerm(body);
  }

  @Patch('terms/:id')
  updateTerm(@Param('id') id: string, @Body() body: any) {
    return this.setupService.updateTerm(id, body);
  }

  @Get('classes')
  listClasses() {
    return this.setupService.listClasses();
  }

  @Post('classes')
  createClass(@Body() body: any) {
    return this.setupService.createClass(body);
  }

  @Patch('classes/:id')
  updateClass(@Param('id') id: string, @Body() body: any) {
    return this.setupService.updateClass(id, body);
  }

  @Get('student-categories')
  listStudentCategories() {
    return this.setupService.listStudentCategories();
  }

  @Post('student-categories')
  createStudentCategory(@Body() body: any) {
    return this.setupService.createStudentCategory(body);
  }

  @Patch('student-categories/:id')
  updateStudentCategory(@Param('id') id: string, @Body() body: any) {
    return this.setupService.updateStudentCategory(id, body);
  }

  @Get('fee-types')
  listFeeTypes() {
    return this.setupService.listFeeTypes();
  }

  @Post('fee-types')
  createFeeType(@Body() body: any) {
    return this.setupService.createFeeType(body);
  }

  @Patch('fee-types/:id')
  updateFeeType(@Param('id') id: string, @Body() body: any) {
    return this.setupService.updateFeeType(id, body);
  }

  @Get('finance-structures')
  listFinanceStructures() {
    return this.setupService.listFinanceStructures();
  }

  @Post('finance-structures')
  createFinanceStructure(@Body() body: any) {
    return this.setupService.createFinanceStructure(body);
  }

  @Patch('finance-structures/:id')
  updateFinanceStructure(@Param('id') id: string, @Body() body: any) {
    return this.setupService.updateFinanceStructure(id, body);
  }

  @Get('registration-data')
  getRegistrationData() {
    return this.setupService.getRegistrationData();
  }
}
