import { Module } from '@nestjs/common';
import { DocumentCategoriesController } from './document-categories.controller.js';
import { DocumentCategoriesService } from './document-categories.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [DocumentCategoriesController],
  providers: [DocumentCategoriesService],
  exports: [DocumentCategoriesService],
})
export class DocumentCategoriesModule {}
