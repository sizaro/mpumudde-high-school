import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller.js';
import { TeachersService } from './teachers.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CommunicationsModule } from '../communications/communications.module.js';

@Module({
  imports: [PrismaModule, CommunicationsModule],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
