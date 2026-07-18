import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('dashboard')
export class DashboardController {

  @Get()
  @UseGuards(JwtAuthGuard)
  getDashboard() {
    return {
      message: 'Welcome to dashboard',
    };
  }
}