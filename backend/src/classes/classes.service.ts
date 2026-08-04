import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateClassDto } from './dto/create-class.dto.js';
import { UpdateClassDto } from './dto/update-class.dto.js';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClassDto) {
    return this.prisma.schoolClass.create({ data: { name: dto.name, isActive: dto.isActive ?? true } });
  }

  async findAll() {
    return this.prisma.schoolClass.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const c = await this.prisma.schoolClass.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Class not found');
    return c;
  }

  async update(id: string, dto: UpdateClassDto) {
    await this.findOne(id);
    return this.prisma.schoolClass.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.schoolClass.delete({ where: { id } });
  }
}
