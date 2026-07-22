import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service.js';
import { FinanceController } from './finance.controller.js';
import { TermsService } from './terms.service.js';
import { TermsController } from './terms.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [FinanceController, TermsController],
  providers: [FinanceService, TermsService],
})
export class FinanceModule {}
