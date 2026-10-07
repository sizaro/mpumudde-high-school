import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller.js';
import { StudentsService } from './students.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CommunicationsModule } from '../communications/communications.module.js';

@Module({
  imports: [PrismaModule, CommunicationsModule],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
