import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTeachingAssignmentDto } from './dto/create-teaching-assignment.dto.js';

@Injectable()
export class TeachingAssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTeachingAssignmentDto) {
    const [teacher, schoolClass, subject] = await Promise.all([
      this.prisma.teacher.findUnique({ where: { id: dto.teacherId } }),
      this.prisma.schoolClass.findUnique({ where: { id: dto.classId } }),
      this.prisma.subject.findUnique({ where: { id: dto.subjectId } }),
    ]);
    if (!teacher) throw new NotFoundException('Teacher not found');
    if (!schoolClass) throw new NotFoundException('Class not found');
    if (!subject) throw new NotFoundException('Subject not found');
    try {
      return await this.prisma.teacherAssignment.create({
        data: { teacherId: dto.teacherId, classId: dto.classId, subjectId: dto.subjectId },
        include: {
          teacher: { select: { id: true, firstName: true, lastName: true } },
          schoolClass: { select: { id: true, name: true } },
          subject: { select: { id: true, name: true, code: true } },
        },
      });
    } catch { throw new BadRequestException('Assignment already exists'); }
  }

  async findAll() {
    return this.prisma.teacherAssignment.findMany({
      include: {
        teacher: { select: { id: true, firstName: true, lastName: true } },
        schoolClass: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async findByTeacher(teacherId: string) {
    return this.prisma.teacherAssignment.findMany({
      where: { teacherId },
      include: {
        schoolClass: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.teacherAssignment.delete({ where: { id } });
  }
}
