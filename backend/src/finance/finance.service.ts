import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFinanceDto } from './dto/create-finance.dto.js';
import { UpdateFinanceDto } from './dto/update-finance.dto.js';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFinanceDto: CreateFinanceDto) {
    return this.prisma.payment.create({
      data: {
        studentId: createFinanceDto.studentId,
        amount: createFinanceDto.amount,
        method: createFinanceDto.method,
        status: createFinanceDto.status ?? 'completed',
        description: createFinanceDto.description,
        date: createFinanceDto.date ? new Date(createFinanceDto.date) : undefined,
      },
    });
  }

  async findAll() {
    return this.prisma.payment.findMany({
      orderBy: { date: 'desc' },
      include: { student: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { student: true },
    });
  }

  async update(id: string, updateFinanceDto: UpdateFinanceDto) {
    return this.prisma.payment.update({
      where: { id },
      data: {
        amount: updateFinanceDto.amount,
        method: updateFinanceDto.method,
        status: updateFinanceDto.status,
        description: updateFinanceDto.description,
        date: updateFinanceDto.date ? new Date(updateFinanceDto.date) : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.payment.delete({
      where: { id },
    });
  }
}
