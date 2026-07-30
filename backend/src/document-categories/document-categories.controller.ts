import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DocumentCategoriesService } from './document-categories.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('document-categories')
export class DocumentCategoriesController {
  constructor(private readonly service: DocumentCategoriesService) {}

  @Get()
  findAll(@Query('entityType') entityType?: string) {
    return this.service.findAll(entityType);
  }
}
