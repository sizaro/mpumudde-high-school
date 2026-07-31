import { Injectable } from '@nestjs/common';
import { CreateParentDto } from './dto/create-parent.dto.js';
import { UpdateParentDto } from './dto/update-parent.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ParentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createParentDto: CreateParentDto) {
    const { studentId, primary: _primary, ...data } = createParentDto;
    return this.prisma.parent.create({
      data: {
        ...data,
        students: studentId ? { create: { studentId, relationship: data.relationship } } : undefined,
      },
      include: { students: { include: { student: true } } },
    });
  }

  async findAll() {
    return this.prisma.parent.findMany({ include: { students: { include: { student: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    return this.prisma.parent.findUnique({ where: { id }, include: { students: { include: { student: true } } } });
  }

  async update(id: string, updateParentDto: UpdateParentDto) {
    const { studentId: _studentId, primary: _primary, ...data } = updateParentDto;
    return this.prisma.parent.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.parent.delete({ where: { id } });
  }
}
