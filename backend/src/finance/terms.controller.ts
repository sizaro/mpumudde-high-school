import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TermsService } from './terms.service.js';
import { CreateTermDto } from './dto/create-term.dto.js';
import { CreateStudentTermFeeDto } from './dto/create-student-term-fee.dto.js';

@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  // TERM ENDPOINTS
  @Post()
  createTerm(@Body() createTermDto: CreateTermDto) {
    return this.termsService.createTerm(createTermDto);
  }

  @Get()
  getAllTerms() {
    return this.termsService.getAllTerms();
  }

  @Get('active')
  getActiveTerm() {
    return this.termsService.getActiveTerm();
  }

  @Post(':termId/assign-all-students')
  assignTermFeeToAllStudents(@Param('termId') termId: string) {
    return this.termsService.assignTermFeeToAllStudents(termId);
  }

  @Get(':termId/students')
  getTermStudentFees(@Param('termId') termId: string) {
    return this.termsService.getTermStudentFees(termId);
  }

  @Get(':termId')
  getTerm(@Param('termId') termId: string) {
    return this.termsService.getTerm(termId);
  }

  // STUDENT TERM FEE ENDPOINTS
  @Post('fees/assign')
  assignTermFeeToStudent(@Body() createStudentTermFeeDto: CreateStudentTermFeeDto) {
    return this.termsService.assignTermFeeToStudent(createStudentTermFeeDto);
  }

  @Get('student/:studentId/fees')
  getStudentTermFees(@Param('studentId') studentId: string) {
    return this.termsService.getStudentTermFees(studentId);
  }
}
