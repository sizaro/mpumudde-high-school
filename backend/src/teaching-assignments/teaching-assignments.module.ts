import { Module } from '@nestjs/common';
import { TeachingAssignmentsController } from './teaching-assignments.controller.js';
import { TeachingAssignmentsService } from './teaching-assignments.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [TeachingAssignmentsController],
  providers: [TeachingAssignmentsService],
  exports: [TeachingAssignmentsService],
})
export class TeachingAssignmentsModule {}
