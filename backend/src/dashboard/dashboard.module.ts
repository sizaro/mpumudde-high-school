import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';
import { FinanceModule } from '../finance/finance.module.js';

@Module({
  imports: [FinanceModule],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
