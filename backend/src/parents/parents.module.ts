import { Module } from '@nestjs/common';
import { ParentsService } from './parents.service.js';
import { ParentsController } from './parents.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CommunicationsModule } from '../communications/communications.module.js';

@Module({
  imports: [PrismaModule, CommunicationsModule],
  controllers: [ParentsController],
  providers: [ParentsService],
})
export class ParentsModule {}
