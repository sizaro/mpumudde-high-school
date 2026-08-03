import { Injectable } from '@nestjs/common';
import { CreateParentDto } from './dto/create-parent.dto.js';
import { UpdateParentDto } from './dto/update-parent.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ParentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyFinance(userId: string) {
    const parent = await this.prisma.parent.findUnique({
      where: { userId },
      include: {
        students: {
          include: {
            student: {
              include: {
                schoolClass: true,
                studentCategory: true,
                financeCharges: { include: { financeStructure: { include: { feeType: true, term: true, academicYear: true } } } },
                payments: { orderBy: { date: 'desc' } },
              },
            },
          },
        },
      },
    });
    if (!parent) return null;
    return {
      parent: { id: parent.id, firstName: parent.firstName, lastName: parent.lastName },
      children: parent.students.map(({ student }) => {
        const expected = student.financeCharges.reduce((sum, charge) => sum + charge.expectedAmount, 0);
        const paid = student.financeCharges.reduce((sum, charge) => sum + charge.paidAmount, 0);
        const waived = student.financeCharges.reduce((sum, charge) => sum + charge.waivedAmount, 0);
        return { ...student, financeSummary: { expected, paid, waived, balance: expected - paid - waived } };
      }),
    };
  }

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
