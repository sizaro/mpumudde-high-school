import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DocumentCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(entityType?: string) {
    return this.prisma.documentCategory.findMany({
      where: { isActive: true, ...(entityType ? { entityType } : {}) },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.documentCategory.findUnique({ where: { id } });
  }
}
