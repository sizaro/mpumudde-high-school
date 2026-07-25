import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FinanceService } from './finance.service.js';
import { CreateFinanceDto } from './dto/create-finance.dto.js';
import { UpdateFinanceDto } from './dto/update-finance.dto.js';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  create(@Body() createFinanceDto: CreateFinanceDto) {
    return this.financeService.create(createFinanceDto);
  }

  @Get()
  findAll() {
    return this.financeService.findAll();
  }

  @Get('students/balances/all')
  getStudentsWithBalances() {
    return this.financeService.getStudentsWithBalances();
  }

  @Get('students/:studentId/balance')
  getStudentBalance(@Param('studentId') studentId: string) {
    return this.financeService.getStudentBalance(studentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinanceDto: UpdateFinanceDto) {
    return this.financeService.update(id, updateFinanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financeService.remove(id);
  }
}
