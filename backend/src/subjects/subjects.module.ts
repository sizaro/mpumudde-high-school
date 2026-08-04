import { Module } from '@nestjs/common';
import { SubjectsController } from './subjects.controller.js';
import { SubjectsService } from './subjects.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [SubjectsService],
})
export class SubjectsModule {}
