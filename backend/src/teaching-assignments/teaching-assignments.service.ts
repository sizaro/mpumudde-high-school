import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTeachingAssignmentDto } from './dto/create-teaching-assignment.dto.js';

@Injectable()
export class TeachingAssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTeachingAssignmentDto) {
    const [teacher, subject, classSubject] = await Promise.all([
      this.prisma.teacher.findUnique({ where: { id: dto.teacherId } }),
      this.prisma.subject.findUnique({ where: { id: dto.subjectId } }),
      dto.classSubjectId
        ? this.prisma.classSubject.findUnique({
            where: { id: dto.classSubjectId },
            include: { academicYearClass: true },
          })
        : null,
    ]);
    if (!teacher) throw new NotFoundException('Teacher not found');
    if (!subject) throw new NotFoundException('Subject not found');
    if (dto.classSubjectId && (!classSubject || classSubject.subjectId !== dto.subjectId)) {
      throw new BadRequestException('The selected subject is not offered to this academic-year class.');
    }
    if (dto.classSubjectId) {
      const duplicate = await this.prisma.teacherAssignment.findFirst({
        where: {
          teacherId: dto.teacherId,
          classSubjectId: dto.classSubjectId,
          isActive: true,
        },
      });
      if (duplicate) throw new BadRequestException('This official assignment already exists.');
    }
    try {
      return await this.prisma.teacherAssignment.create({
        data: {
          teacherId: dto.teacherId,
          subjectId: dto.subjectId,
          academicYearId: dto.academicYearId ?? classSubject?.academicYearClass.academicYearId,
          academicYearClassId: dto.academicYearClassId ?? classSubject?.academicYearClassId,
          classSubjectId: dto.classSubjectId,
          startDate: dto.startDate ? new Date(dto.startDate) : undefined,
          endDate: dto.endDate ? new Date(dto.endDate) : undefined,
          isActive: true,
        },
        include: {
          teacher: { select: { id: true, firstName: true, lastName: true } },
          subject: { select: { id: true, name: true, code: true } },
          academicYear: true,
          academicYearClass: { include: { schoolClass: true } },
          classSubject: { include: { subject: true } },
        },
      });
    } catch { throw new BadRequestException('Assignment already exists'); }
  }

  async findAll() {
    return this.prisma.teacherAssignment.findMany({
      include: {
        teacher: { select: { id: true, firstName: true, lastName: true } },
        subject: { select: { id: true, name: true, code: true } },
        academicYear: true,
        academicYearClass: { include: { schoolClass: true } },
        classSubject: { include: { subject: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByTeacher(teacherId: string) {
    return this.prisma.teacherAssignment.findMany({
      where: { teacherId },
      include: {
        subject: { select: { id: true, name: true, code: true } },
        academicYear: true,
        academicYearClass: { include: { schoolClass: true } },
        classSubject: { include: { subject: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string) {
    return this.prisma.teacherAssignment.update({
      where: { id },
      data: { isActive: false, endDate: new Date() },
    });
  }
}
