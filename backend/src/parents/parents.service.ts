import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateParentDto } from './dto/create-parent.dto.js';
import { UpdateParentDto } from './dto/update-parent.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

function generateTempPassword(length = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

@Injectable()
export class ParentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createParentDto: CreateParentDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createParentDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('A user with this email already exists.');
    }

    const role = await this.prisma.role.findUnique({
      where: { name: 'PARENT' },
    });
    if (!role) {
      throw new BadRequestException('PARENT role is not configured.');
    }

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    const parent = await this.prisma.parent.create({
      data: {
        firstName: createParentDto.firstName,
        lastName: createParentDto.lastName,
        gender: createParentDto.gender,
        phone: createParentDto.phone,
        email: createParentDto.email,
        address: createParentDto.address,
        occupation: createParentDto.occupation,
        profilePhoto: createParentDto.profilePhoto,
        user: {
          create: {
            email: createParentDto.email,
            username: createParentDto.username,
            password: hashedPassword,
            roles: { create: { roleId: role.id } },
          },
        },
      },
      include: { user: { select: { id: true, email: true, username: true, isActive: true } } },
    });

    return {
      parent,
      temporaryPassword: tempPassword,
      credentials: {
        email: createParentDto.email,
        username: createParentDto.username || createParentDto.email,
      },
    };
  }

  async findAll() {
    return this.prisma.parent.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, username: true, isActive: true } },
        students: { include: { student: true } },
      },
    });
  }

  async findOne(id: string) {
    const parent = await this.prisma.parent.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, username: true, isActive: true } },
        students: { include: { student: true } },
      },
    });
    if (!parent) {
      throw new NotFoundException('Parent not found.');
    }
    return parent;
  }

  async findByUserId(userId: string) {
    const parent = await this.prisma.parent.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, email: true, username: true, isActive: true } },
        students: {
          include: {
            student: {
              include: {
                schoolClass: true,
                academicYear: true,
                term: true,
                studentCategory: true,
                attendanceRecords: {
                  orderBy: { createdAt: 'desc' },
                  take: 20,
                  include: {
                    attendanceSession: {
                      select: {
                        date: true,
                        subject: { select: { id: true, name: true } },
                        teacher: { select: { firstName: true, lastName: true } },
                      },
                    },
                  },
                },
                payments: true,
              },
            },
          },
        },
      },
    });
    if (!parent) {
      throw new NotFoundException('Parent profile not found.');
    }
    return parent;
  }

  async getDashboard(userId: string, studentId?: string) {
    const parent = await this.prisma.parent.findUnique({
      where: { userId },
      include: {
        students: {
          include: {
            student: {
              include: {
                schoolClass: true,
                academicYear: true,
                term: true,
                studentCategory: true,
                attendanceRecords: {
                  orderBy: { createdAt: 'desc' },
                  take: 20,
                  include: {
                    attendanceSession: {
                      select: {
                        date: true,
                        subject: { select: { id: true, name: true } },
                        teacher: { select: { firstName: true, lastName: true } },
                      },
                    },
                  },
                },
                payments: true,
              },
            },
          },
        },
      },
    });

    if (!parent) {
      throw new NotFoundException('Parent profile not found.');
    }

    const children = (parent.students ?? [])
      .map((relation) => ({
        relationId: relation.id,
        relationship: relation.relationship,
        isPrimary: relation.isPrimary,
        student: relation.student,
      }))
      .filter((entry) => entry.student !== null);

    const parentPayload = {
      id: parent.id,
      firstName: parent.firstName,
      lastName: parent.lastName,
      phone: parent.phone,
      email: parent.email,
      address: parent.address,
      occupation: parent.occupation,
      profilePhoto: parent.profilePhoto,
    };

    const childrenPayload = children.map((child) => ({
      studentId: child.student.id,
      admissionNumber: child.student.admissionNumber,
      firstName: child.student.firstName,
      lastName: child.student.lastName,
      isPrimary: child.isPrimary,
      relationship: child.relationship,
      className: child.student.schoolClass?.name,
      academicYear: child.student.academicYear?.name,
      term: child.student.term?.name,
    }));

    const selectedChild = studentId
      ? children.find((child) => child.student.id === studentId)
      : children[0];

    const response: Record<string, unknown> = {
      parent: parentPayload,
      children: childrenPayload,
    };

    if (selectedChild) {
      response.student = this.buildStudentDashboard(selectedChild.student);
    }

    if (studentId && !selectedChild) {
      throw new NotFoundException('Student not found for this parent.');
    }

    return response;
  }

  private buildStudentDashboard(student: any) {
    const attendance = student.attendanceRecords.map((record: any) => ({
      date: record.attendanceSession?.date,
      subject: record.attendanceSession?.subject?.name,
      teacher: record.attendanceSession?.teacher
        ? `${record.attendanceSession.teacher.firstName} ${record.attendanceSession.teacher.lastName}`
        : null,
      status: record.status,
    }));

    const financeSummary = {
      payments: student.payments.map((payment: any) => ({
        id: payment.id,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        date: payment.date,
        description: payment.description,
      })),
      totalPaid: student.payments.reduce((sum: number, payment: any) => sum + payment.amount, 0),
    };

    return {
      profile: {
        id: student.id,
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        passportPhoto: student.passportPhoto,
        className: student.schoolClass?.name,
        academicYear: student.academicYear?.name,
      },
      attendance,
      finance: financeSummary,
      academicPerformance: {
        message: 'Academic performance details are not available in the current schema.',
        grades: student.grades ?? [],
      },
    };
  }

  async update(userId: string, updateParentDto: UpdateParentDto) {
    const parent = await this.prisma.parent.findUnique({ where: { userId } });
    if (!parent) {
      throw new NotFoundException('Parent profile not found.');
    }

    const data: Record<string, unknown> = {};
    if (updateParentDto.firstName !== undefined) data.firstName = updateParentDto.firstName;
    if (updateParentDto.lastName !== undefined) data.lastName = updateParentDto.lastName;
    if (updateParentDto.gender !== undefined) data.gender = updateParentDto.gender;
    if (updateParentDto.phone !== undefined) data.phone = updateParentDto.phone;
    if (updateParentDto.address !== undefined) data.address = updateParentDto.address;
    if (updateParentDto.occupation !== undefined) data.occupation = updateParentDto.occupation;
    if (updateParentDto.profilePhoto !== undefined) data.profilePhoto = updateParentDto.profilePhoto;

    if (updateParentDto.email !== undefined) {
      const existingUser = await this.prisma.user.findUnique({ where: { email: updateParentDto.email } });
      if (existingUser && existingUser.id !== parent.userId) {
        throw new BadRequestException('Email is already in use by another account.');
      }
      data.email = updateParentDto.email;
      await this.prisma.user.update({
        where: { id: parent.userId },
        data: { email: updateParentDto.email },
      });
    }

    return this.prisma.parent.update({
      where: { id: parent.id },
      data,
      include: {
        user: { select: { id: true, email: true, username: true, isActive: true } },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.parent.delete({ where: { id } });
  }
}
