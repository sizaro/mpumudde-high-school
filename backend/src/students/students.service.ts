import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { LinkParentDto } from './dto/link-parent.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { CreateStudentParentDto } from './dto/create-student-parent.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateTempPassword(length = 12): Promise<string> {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  private async createParentAccount(
    tx: any,
    parentDto: CreateStudentParentDto,
  ) {
    if (!parentDto.email) {
      throw new BadRequestException('Parent email is required for user account creation.');
    }
    const existingUser = await tx.user.findUnique({ where: { email: parentDto.email } });
    if (existingUser) {
      const existingParent = await tx.parent.findUnique({ where: { userId: existingUser.id } });
      if (existingParent) {
        return existingParent;
      }

      return tx.parent.create({
        data: {
          firstName: parentDto.firstName,
          lastName: parentDto.lastName,
          gender: parentDto.gender,
          phone: parentDto.phone,
          email: parentDto.email,
          address: parentDto.address,
          occupation: parentDto.occupation,
          profilePhoto: parentDto.profilePhoto,
          user: {
            connect: {
              id: existingUser.id,
            },
          },
        },
      });
    }

    const role = await tx.role.findUnique({ where: { name: 'PARENT' } });
    if (!role) {
      throw new BadRequestException('PARENT role is not configured.');
    }

    const tempPassword = await this.generateTempPassword();
    const password = await bcrypt.hash(tempPassword, 12);

    const parent = await tx.parent.create({
      data: {
        firstName: parentDto.firstName,
        lastName: parentDto.lastName,
        gender: parentDto.gender,
        phone: parentDto.phone,
        email: parentDto.email,
        address: parentDto.address,
        occupation: parentDto.occupation,
        profilePhoto: parentDto.profilePhoto,
        user: {
          create: {
            email: parentDto.email,
            username: parentDto.username,
            password,
            roles: {
              create: {
                roleId: role.id,
              },
            },
          },
        },
      },
    });

    return parent;
  }

  async create(createStudentDto: CreateStudentDto) {
    const parents = createStudentDto.parents ?? [];

    if (parents.length > 0 && parents.filter((parent) => parent.isPrimary).length !== 1) {
      throw new BadRequestException('Exactly one parent must be marked as primary contact.');
    }

    return this.prisma.$transaction(async (tx) => {
      const student = await tx.student.create({
        data: {
          admissionNumber: createStudentDto.admissionNumber,
          firstName: createStudentDto.firstName,
          lastName: createStudentDto.lastName,
          dateOfBirth: createStudentDto.dateOfBirth ? new Date(createStudentDto.dateOfBirth) : undefined,
          gender: createStudentDto.gender,
          passportPhoto: createStudentDto.passportPhoto,
          isActive: createStudentDto.isActive ?? true,
          academicYearId: createStudentDto.academicYearId,
          termId: createStudentDto.termId,
          classId: createStudentDto.classId,
          studentCategoryId: createStudentDto.studentCategoryId,
        },
      });

      for (const parentDto of parents) {
        let parent: { id: string } | null = null;
        if (parentDto.parentId) {
          parent = await tx.parent.findUnique({ where: { id: parentDto.parentId } });
          if (!parent) {
            throw new NotFoundException(`Parent with ID ${parentDto.parentId} was not found.`);
          }
        } else {
          if (!parentDto.firstName || !parentDto.lastName || !parentDto.email) {
            throw new BadRequestException('Parent firstName, lastName, and email are required when creating a new parent.');
          }
          parent = await this.createParentAccount(tx, parentDto);
        }

        if (!parent) {
          throw new NotFoundException('Parent could not be resolved for this student.');
        }

        await tx.studentParent.create({
          data: {
            studentId: student.id,
            parentId: parent.id,
            relationship: parentDto.relationship,
            isPrimary: parentDto.isPrimary ?? false,
          },
        });
      }

      return tx.student.findUnique({
        where: { id: student.id },
        include: {
          academicYear: true,
          term: true,
          schoolClass: true,
          studentCategory: true,
          parents: {
            include: {
              parent: true,
            },
          },
          payments: true,
        },
      });
    });
  }

  async linkParent(studentId: string, linkParentDto: LinkParentDto) {
    const student = await this.prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Student not found.');
    }

    const parent = await this.prisma.parent.findUnique({ where: { id: linkParentDto.parentId } });
    if (!parent) {
      throw new NotFoundException('Parent not found.');
    }

    const existingLink = await this.prisma.studentParent.findUnique({
      where: {
        studentId_parentId: {
          studentId,
          parentId: linkParentDto.parentId,
        },
      },
    });

    if (existingLink) {
      throw new BadRequestException('This parent is already linked to the student.');
    }

    return this.prisma.studentParent.create({
      data: {
        studentId,
        parentId: linkParentDto.parentId,
        relationship: linkParentDto.relationship,
        isPrimary: linkParentDto.isPrimary ?? false,
      },
      include: {
        parent: true,
      },
    });
  }

  async findAll() {
    return this.prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        parents: {
          include: {
            parent: true,
          },
        },
        payments: true,
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        parents: {
          include: {
            parent: true,
          },
        },
        payments: true,
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
      },
    });
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const data: Record<string, unknown> = {};

    if (updateStudentDto.admissionNumber !== undefined) {
      data.admissionNumber = updateStudentDto.admissionNumber;
    }
    if (updateStudentDto.firstName !== undefined) {
      data.firstName = updateStudentDto.firstName;
    }
    if (updateStudentDto.lastName !== undefined) {
      data.lastName = updateStudentDto.lastName;
    }
    if (updateStudentDto.dateOfBirth !== undefined) {
      data.dateOfBirth = updateStudentDto.dateOfBirth ? new Date(updateStudentDto.dateOfBirth) : null;
    }
    if (updateStudentDto.gender !== undefined) {
      data.gender = updateStudentDto.gender;
    }
    if (updateStudentDto.passportPhoto !== undefined) {
      data.passportPhoto = updateStudentDto.passportPhoto;
    }
    if (updateStudentDto.isActive !== undefined) {
      data.isActive = updateStudentDto.isActive;
    }
    if (updateStudentDto.academicYearId !== undefined) {
      data.academicYearId = updateStudentDto.academicYearId;
    }
    if (updateStudentDto.termId !== undefined) {
      data.termId = updateStudentDto.termId;
    }
    if (updateStudentDto.classId !== undefined) {
      data.classId = updateStudentDto.classId;
    }
    if (updateStudentDto.studentCategoryId !== undefined) {
      data.studentCategoryId = updateStudentDto.studentCategoryId;
    }

    return this.prisma.student.update({
      where: { id },
      data,
      include: {
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.student.delete({
      where: { id },
    });
  }

  async getFinanceSummary(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
        payments: {
          include: {
            financeStructure: {
              include: {
                feeType: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      return null;
    }

    const financeStructures = await this.prisma.financeStructure.findMany({
      where: {
        academicYearId: student.academicYearId ?? undefined,
        termId: student.termId ?? undefined,
        classId: student.classId ?? undefined,
        studentCategoryId: student.studentCategoryId ?? undefined,
      },
      include: {
        feeType: true,
      },
    });

    const summary = financeStructures.map((structure) => {
      const paid = student.payments
        .filter((payment) => payment.financeStructureId === structure.id)
        .reduce((sum, payment) => sum + payment.amount, 0);

      return {
        feeType: structure.feeType?.name ?? 'Fee',
        expectedAmount: structure.expectedAmount,
        paidAmount: paid,
        balance: structure.expectedAmount - paid,
        financeStructureId: structure.id,
      };
    });

    return {
      student: {
        id: student.id,
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        passportPhoto: student.passportPhoto,
        academicYear: student.academicYear?.name,
        term: student.term?.name,
        className: student.schoolClass?.name,
        studentCategory: student.studentCategory?.name,
      },
      summary,
      totalExpected: summary.reduce((sum, item) => sum + item.expectedAmount, 0),
      totalPaid: summary.reduce((sum, item) => sum + item.paidAmount, 0),
      totalBalance: summary.reduce((sum, item) => sum + item.balance, 0),
    };
  }
}
