import { Module } from '@nestjs/common';
import { ParentsService } from './parents.service.js';
import { ParentsController } from './parents.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ParentsController],
  providers: [ParentsService],
})
export class ParentsModule {}
