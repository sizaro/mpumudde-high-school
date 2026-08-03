import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FinanceService } from './finance.service.js';
import { CreateFinanceDto } from './dto/create-finance.dto.js';
import { UpdateFinanceDto } from './dto/update-finance.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { PermissionsGuard } from '../auth/guards/permissions.guard.js';
import { Permissions } from '../common/decorators/permissions.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto.js';
import { UpdateFeeStructureDto } from './dto/update-fee-structure.dto.js';
import { ListFeeStructuresDto } from './dto/list-fee-structures.dto.js';
import { ReversePaymentDto } from './dto/reverse-payment.dto.js';
import { ListStudentAccountsDto } from './dto/list-student-accounts.dto.js';
import { CreateExpenseDto, ExpenseDecisionDto } from './dto/create-expense.dto.js';
import { CreatePayrollPaymentDto } from './dto/create-payroll-payment.dto.js';
import { CreateOtherIncomeDto } from './dto/create-other-income.dto.js';
import { ListPaymentsDto, SearchPaymentStudentsDto } from './dto/list-payments.dto.js';
import { ListExpensesDto } from './dto/list-expenses.dto.js';

@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('fee-types')
  @Permissions('finance.fee-structures.view')
  listFeeTypes() { return this.financeService.listFeeTypes(); }

  @Post('fee-types')
  @Permissions('finance.fee-structures.manage')
  createFeeType(@Body() body: { name: string; isActive?: boolean }) {
    return this.financeService.createFeeType(body);
  }

  @Patch('fee-types/:id')
  @Permissions('finance.fee-structures.manage')
  updateFeeType(@Param('id') id: string, @Body() body: { name?: string; isActive?: boolean }) {
    return this.financeService.updateFeeType(id, body);
  }

  @Delete('fee-types/:id')
  @Permissions('finance.fee-structures.manage')
  deleteFeeType(@Param('id') id: string) {
    return this.financeService.deleteFeeType(id);
  }

  @Get('fee-structures')
  @Permissions('finance.fee-structures.view')
  findAllFeeStructures(@Query() query: ListFeeStructuresDto) {
    return this.financeService.listFeeStructures(query);
  }

  @Get('fee-structures/:id')
  @Permissions('finance.fee-structures.view')
  findOneFeeStructure(@Param('id') id: string) {
    return this.financeService.getFeeStructure(id);
  }

  @Post('fee-structures')
  @Permissions('finance.fee-structures.manage')
  createFeeStructure(
    @Body() createFeeStructureDto: CreateFeeStructureDto,
    @CurrentUser() user: { id?: string },
  ) {
    return this.financeService.createFeeStructure(createFeeStructureDto, user);
  }

  @Patch('fee-structures/:id')
  @Permissions('finance.fee-structures.manage')
  updateFeeStructure(
    @Param('id') id: string,
    @Body() updateFeeStructureDto: UpdateFeeStructureDto,
    @CurrentUser() user: { id?: string },
  ) {
    return this.financeService.updateFeeStructure(
      id,
      updateFeeStructureDto,
      user,
    );
  }

  @Patch('fee-structures/:id/activate')
  @Permissions('finance.fee-structures.manage')
  activateFeeStructure(
    @Param('id') id: string,
    @CurrentUser() user: { id?: string },
  ) {
    return this.financeService.setFeeStructureStatus(id, true, user);
  }

  @Patch('fee-structures/:id/deactivate')
  @Permissions('finance.fee-structures.manage')
  deactivateFeeStructure(
    @Param('id') id: string,
    @CurrentUser() user: { id?: string },
  ) {
    return this.financeService.setFeeStructureStatus(id, false, user);
  }

  @Post('fee-structures/:id/apply')
  @Permissions('finance.fee-structures.manage')
  applyFeeStructure(@Param('id') id: string) {
    return this.financeService.applyFeeStructure(id);
  }

  @Post()
  @Permissions('finance.payments.create')
  create(@Body() createFinanceDto: CreateFinanceDto, @CurrentUser() user: { id?: string }) {
    return this.financeService.create(createFinanceDto, user);
  }

  @Get()
  @Permissions('finance.payments.view')
  findAll(@Query() query: ListPaymentsDto) {
    return this.financeService.findAll(query);
  }

  @Get('payment-options')
  @Permissions('finance.payments.view')
  paymentOptions() { return this.financeService.getPaymentOptions(); }

  @Get('payment-options/students')
  @Permissions('finance.payments.create')
  paymentStudents(@Query() query: SearchPaymentStudentsDto) {
    return this.financeService.searchPaymentStudents(query);
  }

  @Get('summary')
  @Permissions('finance.view')
  summary(
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('termId') termId?: string,
    @Query('academicYearId') academicYearId?: string,
  ) {
    return this.financeService.getSummary({ start, end, termId, academicYearId });
  }

  @Get('expenses')
  @Permissions('finance.expenses.view')
  listExpenses(@Query() query: ListExpensesDto) { return this.financeService.listExpenses(query); }

  @Get('expense-options')
  @Permissions('finance.expenses.view')
  expenseOptions() { return this.financeService.getExpenseOptions(); }

  @Post('expenses')
  @Permissions('finance.expenses.create')
  createExpense(@Body() dto: CreateExpenseDto, @CurrentUser() user: { id?: string }) { return this.financeService.createExpense(dto, user); }

  @Get('other-income')
  @Permissions('finance.income.view')
  listOtherIncome() { return this.financeService.listOtherIncome(); }

  @Post('other-income')
  @Permissions('finance.income.create')
  createOtherIncome(@Body() dto: CreateOtherIncomeDto, @CurrentUser() user: { id?: string }) { return this.financeService.createOtherIncome(dto, user); }

  @Patch('expenses/:id/decision')
  @Permissions('finance.approve')
  decideExpense(@Param('id') id: string, @Body() dto: ExpenseDecisionDto, @CurrentUser() user: { id?: string }) { return this.financeService.decideExpense(id, dto.status, dto.reason, user); }

  @Get('payroll/teachers')
  @Permissions('finance.payroll.view')
  listPayrollTeachers() { return this.financeService.listPayrollTeachers(); }

  @Post('payroll/payments')
  @Permissions('finance.payroll.manage')
  createPayrollPayment(@Body() dto: CreatePayrollPaymentDto, @CurrentUser() user: { id?: string }) {
    return this.financeService.createPayrollPayment(dto, user);
  }

  @Get('student-accounts')
  @Permissions('finance.accounts.view')
  listStudentAccounts(@Query() query: ListStudentAccountsDto) {
    return this.financeService.listStudentAccounts(query);
  }

  @Get('student-accounts/:studentId')
  @Permissions('finance.accounts.view')
  getStudentAccount(@Param('studentId') studentId: string) {
    return this.financeService.getStudentAccount(studentId);
  }

  @Post('student-accounts/:studentId/sync-charges')
  @Permissions('finance.accounts.view')
  syncStudentCharges(@Param('studentId') studentId: string) {
    return this.financeService.syncStudentCharges(studentId);
  }

  @Get('students/balances/all')
  @Permissions('finance.accounts.view')
  getStudentsWithBalances() {
    return this.financeService.getStudentsWithBalances();
  }

  @Get('students/:studentId/balance')
  @Permissions('finance.accounts.view')
  getStudentBalance(@Param('studentId') studentId: string) {
    return this.financeService.getStudentBalance(studentId);
  }

  @Get(':id')
  @Permissions('finance.payments.view')
  findOne(@Param('id') id: string) {
    return this.financeService.findOne(id);
  }

  @Patch(':id')
  @Permissions('finance.payments.edit')
  update(@Param('id') id: string, @Body() updateFinanceDto: UpdateFinanceDto, @CurrentUser() user: { id?: string }) {
    return this.financeService.update(id, updateFinanceDto, user);
  }

  @Delete(':id')
  @Permissions('finance.payments.edit')
  removeDraft(@Param('id') id: string, @CurrentUser() user: { id?: string }) {
    return this.financeService.cancelDraftPayment(id, user);
  }

  @Post(':id/reverse')
  @Permissions('finance.payments.reverse')
  reverse(@Param('id') id: string, @Body() dto: ReversePaymentDto, @CurrentUser() user: { id?: string }) {
    return this.financeService.reversePayment(id, dto.reason, user);
  }
}
