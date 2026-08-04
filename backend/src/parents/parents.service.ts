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

  async create(createParentDto: CreateParentDto, uploadedByUserId?: string) {
    const studentLinks = createParentDto.students?.length
      ? createParentDto.students
      : createParentDto.studentId
        ? [{
            studentId: createParentDto.studentId,
            relationship: createParentDto.relationship,
            isPrimary: createParentDto.isPrimary ?? false,
          }]
        : [];
    if (studentLinks.length === 0) {
      throw new BadRequestException('A guardian must be linked to at least one student.');
    }
    if (new Set(studentLinks.map((link) => link.studentId)).size !== studentLinks.length) {
      throw new BadRequestException('The same student cannot be linked more than once.');
    }

    const shouldCreateLogin = createParentDto.createLoginAccount ?? false;
    const loginEmail = shouldCreateLogin
      ? (createParentDto.loginEmail?.trim().toLowerCase()
          ?? await this.generateUniqueLoginEmail(createParentDto.firstName, createParentDto.lastName))
      : undefined;

    const existingUser = loginEmail
      ? await this.prisma.user.findUnique({ where: { email: loginEmail } })
      : null;
    if (shouldCreateLogin && existingUser) {
      throw new BadRequestException('A user with this login email already exists.');
    }

    const role = shouldCreateLogin
      ? await this.prisma.role.findUnique({ where: { name: 'PARENT' } })
      : null;
    if (shouldCreateLogin && !role) {
      throw new BadRequestException('PARENT role is not configured.');
    }

    const temporaryPassword = shouldCreateLogin ? generateTempPassword() : undefined;
    const hashedPassword = temporaryPassword
      ? await bcrypt.hash(temporaryPassword, 12)
      : undefined;

    const createdId = await this.prisma.$transaction(async (tx) => {
      const students = await tx.student.findMany({
        where: { id: { in: studentLinks.map((link) => link.studentId) } },
        select: { id: true },
      });
      if (students.length !== studentLinks.length) {
        throw new BadRequestException('One or more selected students do not exist.');
      }

      const documentCategoryIds = (createParentDto.documents ?? []).map((document) => document.documentCategoryId);
      if (documentCategoryIds.length) {
        const categoryCount = await tx.documentCategory.count({
          where: { id: { in: documentCategoryIds }, entityType: 'PARENT', isActive: true },
        });
        if (categoryCount !== new Set(documentCategoryIds).size) {
          throw new BadRequestException('One or more guardian document categories are invalid.');
        }
      }

      const parent = await tx.parent.create({
        data: {
          firstName: createParentDto.firstName,
          lastName: createParentDto.lastName,
          gender: createParentDto.gender,
          phone: createParentDto.phone,
          email: createParentDto.email,
          address: createParentDto.address,
          occupation: createParentDto.occupation,
          profilePhoto: createParentDto.profilePhoto,
          relationship: createParentDto.relationship,
          identityDocumentType: createParentDto.identityDocumentType,
          identityDocumentUrl: createParentDto.identityDocumentUrl,
          user: shouldCreateLogin
            ? {
                create: {
                  email: loginEmail!,
                  username: createParentDto.username,
                  password: hashedPassword!,
                  roles: { create: { roleId: role!.id } },
                },
              }
            : undefined,
        },
        include: { user: { select: { id: true, email: true, username: true, isActive: true, isLoggedIn: true, lastLogin: true } } },
      });

      for (const link of studentLinks) {
        if (link.isPrimary) {
          await tx.studentParent.updateMany({
            where: { studentId: link.studentId, isActive: true },
            data: { isPrimary: false },
          });
        }
        await tx.studentParent.create({
          data: {
            studentId: link.studentId,
            parentId: parent.id,
            relationship: link.relationship,
            isPrimary: link.isPrimary ?? false,
          },
        });
      }

      if (createParentDto.documents?.length) {
        await tx.document.createMany({
          data: createParentDto.documents.map((document) => ({
            entityType: 'PARENT',
            entityId: parent.id,
            documentCategoryId: document.documentCategoryId,
            title: document.title,
            originalFileName: document.originalFileName,
            fileUrl: document.fileUrl,
            mimeType: document.mimeType,
            fileExtension: document.fileExtension,
            fileSize: document.fileSize,
            uploadedByUserId,
          })),
        });
      }

      return {
        id: parent.id,
      };
    });

    return {
      parent: await this.findOne(createdId.id),
      temporaryPassword,
      credentials: temporaryPassword
        ? { email: loginEmail!, username: createParentDto.username || loginEmail! }
        : undefined,
    };
  }

  async findAll() {
    return this.prisma.parent.findMany({
      where: { isActive: true, students: { some: { isActive: true } } },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, username: true, isActive: true, isLoggedIn: true, lastLogin: true } },
        students: { where: { isActive: true }, include: { student: { include: { schoolClass: true, academicYear: true, term: true } } } },
      },
    });
  }

  async findOne(id: string) {
    const [parent, documents] = await Promise.all([
      this.prisma.parent.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, email: true, username: true, isActive: true, isLoggedIn: true, lastLogin: true } },
          students: { include: { student: { include: { schoolClass: true, academicYear: true, term: true, studentCategory: true } } } },
        },
      }),
      this.prisma.document.findMany({
        where: { entityType: 'PARENT', entityId: id, isActive: true },
        include: { documentCategory: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    if (!parent) {
      throw new NotFoundException('Parent not found.');
    }
    return { ...parent, documents };
  }

  async findByUserId(userId: string) {
    const parent = await this.prisma.parent.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, email: true, username: true, isActive: true } },
        students: {
          where: { isActive: true },
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
                payments: {
                  orderBy: { createdAt: 'desc' },
                  include: { feeType: true, financeStructure: true },
                },
                financeCharges: {
                  include: {
                    financeStructure: {
                      include: { feeType: true, academicYear: true, term: true },
                    },
                  },
                },
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
            where: { isActive: true },
            select: {
              id: true,
              relationship: true,
              isPrimary: true,
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
                  payments: {
                    orderBy: { createdAt: 'desc' },
                    include: { feeType: true, financeStructure: true },
                  },
                  financeCharges: {
                    include: {
                      financeStructure: {
                        include: { feeType: true, academicYear: true, term: true },
                      },
                    },
                  },
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
        .filter((relation) => relation.student !== null)
        .map((relation) => ({
          relationId: relation.id,
          relationship: relation.relationship ?? null,
          isPrimary: relation.isPrimary ?? false,
          student: relation.student!,
        }));

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
        className: child.student.schoolClass?.name ?? null,
        academicYear: child.student.academicYear?.name ?? null,
        term: child.student.term?.name ?? null,
        termStartDate: child.student.term?.startDate ?? null,
        termEndDate: child.student.term?.endDate ?? null,
        profilePhoto: child.student.passportPhoto ?? null,
        finance: (() => {
          const summary = this.buildStudentDashboard(child.student).finance;
          return { totalExpected: summary.totalExpected, totalPaid: summary.totalPaid, outstandingBalance: summary.outstandingBalance };
        })(),
      }));

      const selectedChild = studentId
        ? children.find((child) => child.student.id === studentId)
        : children[0];

      const response: Record<string, unknown> = {
        parent: parentPayload,
        children: childrenPayload,
        familySummary: children.reduce((summary, child) => {
          const finance = this.buildStudentDashboard(child.student).finance;
          summary.totalExpected += finance.totalExpected;
          summary.totalPaid += finance.totalPaid;
          summary.outstandingBalance += finance.outstandingBalance;
          summary.childrenWithBalances += finance.outstandingBalance > 0 ? 1 : 0;
          summary.fullyPaidChildren += finance.totalExpected > 0 && finance.outstandingBalance <= 0 ? 1 : 0;
          for (const record of child.student.attendanceRecords ?? []) {
            const status = String(record.status ?? '').toUpperCase();
            summary.recentAttendanceRecords += 1;
            if (status === 'PRESENT') summary.recentPresent += 1;
            if (status === 'ABSENT') summary.recentAbsent += 1;
            if (status === 'LATE') summary.recentLate += 1;
          }
          return summary;
        }, { totalExpected: 0, totalPaid: 0, outstandingBalance: 0, childrenWithBalances: 0, fullyPaidChildren: 0, recentAttendanceRecords: 0, recentPresent: 0, recentAbsent: 0, recentLate: 0 }),
      };

      if (selectedChild?.student) {
        response.student = this.buildStudentDashboard(selectedChild.student);
      }

      if (studentId && !selectedChild) {
        throw new NotFoundException('Student not found for this parent.');
      }

    return response;
  }

  async getChildAttendance(userId: string, studentId: string, filters: { startDate?: string; endDate?: string; subjectId?: string }) {
    const relation = await this.prisma.studentParent.findFirst({
      where: { studentId, isActive: true, parent: { userId, isActive: true } },
      select: { student: { select: { id: true, firstName: true, lastName: true, admissionNumber: true, passportPhoto: true, schoolClass: { select: { name: true } } } } },
    });
    if (!relation) throw new NotFoundException('Student not found for this parent.');
    const dateFilter = filters.startDate || filters.endDate ? {
      ...(filters.startDate ? { gte: new Date(`${filters.startDate}T00:00:00+03:00`) } : {}),
      ...(filters.endDate ? { lte: new Date(`${filters.endDate}T23:59:59+03:00`) } : {}),
    } : undefined;
    const records = await this.prisma.attendanceRecord.findMany({
      where: {
        studentId,
        attendanceSession: {
          ...(dateFilter ? { date: dateFilter } : {}),
          ...(filters.subjectId ? { subjectId: filters.subjectId } : {}),
        },
      },
      include: {
        attendanceSession: { include: { subject: true, teacher: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { attendanceSession: { date: 'desc' } },
    });
    return {
      student: relation.student,
      subjects: Array.from(new Map(records.map((record) => [record.attendanceSession.subject.id, record.attendanceSession.subject])).values()),
      records: records.map((record) => ({
        id: record.id, status: record.status, date: record.attendanceSession.date,
        subjectId: record.attendanceSession.subject.id, subject: record.attendanceSession.subject.name,
        teacher: `${record.attendanceSession.teacher.firstName} ${record.attendanceSession.teacher.lastName}`,
      })),
    };
  }

  private buildStudentDashboard(student: any) {
    const attendanceRecords = Array.isArray(student.attendanceRecords)
      ? student.attendanceRecords
      : [];
    const payments = Array.isArray(student.payments) ? student.payments : [];
    const charges = Array.isArray(student.financeCharges) ? student.financeCharges : [];

    const attendance = attendanceRecords.map((record: any) => ({
      date: record.attendanceSession?.date,
      subject: record.attendanceSession?.subject?.name ?? null,
      teacher: record.attendanceSession?.teacher
        ? `${record.attendanceSession.teacher.firstName} ${record.attendanceSession.teacher.lastName}`
        : null,
      status: record.status ?? null,
    }));

    const activePayments = payments.filter(
      (payment: any) => !['REVERSED', 'REJECTED'].includes(String(payment.status ?? '').toUpperCase()),
    );
    const totalExpected = charges.reduce(
      (sum: number, charge: any) => sum + (charge.expectedAmount ?? 0),
      0,
    );
    const totalPaid = charges.length
      ? charges.reduce((sum: number, charge: any) => sum + (charge.paidAmount ?? 0), 0)
      : activePayments.reduce((sum: number, payment: any) => sum + (payment.amount ?? 0), 0);
    const totalWaived = charges.reduce(
      (sum: number, charge: any) => sum + (charge.waivedAmount ?? 0),
      0,
    );

    const financeSummary = {
      payments: payments.map((payment: any) => ({
        id: payment.id,
        amount: payment.amount ?? 0,
        method: payment.method ?? null,
        status: payment.status ?? null,
        date: payment.date ?? null,
        description: payment.description ?? null,
        receiptNumber: payment.receiptNumber ?? null,
        proofUrl: payment.proofUrl ?? payment.receiptUrl ?? null,
        proofFileName: payment.proofFileName ?? null,
        feeType: payment.feeType?.name ?? null,
      })),
      charges: charges.map((charge: any) => ({
        id: charge.id,
        feeType: charge.financeStructure?.feeType?.name ?? 'Fee',
        academicYear: charge.financeStructure?.academicYear?.name ?? null,
        term: charge.financeStructure?.term?.name ?? null,
        expectedAmount: charge.expectedAmount ?? 0,
        paidAmount: charge.paidAmount ?? 0,
        waivedAmount: charge.waivedAmount ?? 0,
        balance: Math.max(0, (charge.expectedAmount ?? 0) - (charge.paidAmount ?? 0) - (charge.waivedAmount ?? 0)),
        status: charge.status ?? 'NOT_PAID',
      })),
      totalExpected,
      totalPaid,
      totalWaived,
      outstandingBalance: Math.max(0, totalExpected - totalPaid - totalWaived),
    };

    return {
      profile: {
        id: student.id,
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        passportPhoto: student.passportPhoto ?? null,
        className: student.schoolClass?.name ?? null,
        academicYear: student.academicYear?.name ?? null,
      },
      attendance,
      finance: financeSummary,
      academicPerformance: {
        message: 'Academic performance details are not available in the current schema.',
        grades: Array.isArray(student.grades) ? student.grades : [],
      },
    };
  }

  async updateMyProfile(userId: string, updateParentDto: UpdateParentDto) {
    const parent = await this.prisma.parent.findUnique({ where: { userId } });
    if (!parent) {
      throw new NotFoundException('Parent profile not found.');
    }

    // The communication email belongs to the guardian profile. Portal login
    // credentials are managed separately by the Director.
    return this.updateParentRecord(parent.id, updateParentDto);
  }

  async updateById(id: string, updateParentDto: UpdateParentDto) {
    const parent = await this.prisma.parent.findUnique({ where: { id } });
    if (!parent) throw new NotFoundException('Parent profile not found.');
    return this.updateParentRecord(parent.id, updateParentDto);
  }

  async updateComplete(id: string, dto: CreateParentDto, changedByUserId?: string) {
    const links = dto.students ?? [];
    if (links.length === 0) throw new BadRequestException('A guardian must remain linked to at least one student.');
    if (new Set(links.map((link) => link.studentId)).size !== links.length) {
      throw new BadRequestException('The same student cannot be linked more than once.');
    }
    const parent = await this.prisma.parent.findUnique({ where: { id }, select: { id: true, isActive: true } });
    if (!parent) throw new NotFoundException('Parent profile not found.');
    if (!parent.isActive) throw new BadRequestException('Archived guardians cannot be edited.');

    await this.prisma.$transaction(async (tx) => {
      const students = await tx.student.findMany({ where: { id: { in: links.map((link) => link.studentId) } }, select: { id: true } });
      if (students.length !== links.length) throw new BadRequestException('One or more selected students do not exist.');
      const existing = await tx.studentParent.findMany({ where: { parentId: id, isActive: true } });
      const desiredIds = new Set(links.map((link) => link.studentId));
      for (const removed of existing.filter((link) => !desiredIds.has(link.studentId))) {
        await tx.studentParent.update({ where: { id: removed.id }, data: { isActive: false, isPrimary: false, unlinkedAt: new Date(), unlinkedByUserId: changedByUserId, unlinkReason: 'Removed during guardian update' } });
      }
      for (const link of links) {
        if (link.isPrimary) {
          await tx.studentParent.updateMany({ where: { studentId: link.studentId, isActive: true }, data: { isPrimary: false } });
        }
        await tx.studentParent.upsert({
          where: { studentId_parentId: { studentId: link.studentId, parentId: id } },
          create: { studentId: link.studentId, parentId: id, relationship: link.relationship, isPrimary: link.isPrimary ?? false },
          update: { relationship: link.relationship, isPrimary: link.isPrimary ?? false, isActive: true, unlinkedAt: null, unlinkedByUserId: null, unlinkReason: null },
        });
      }
      await tx.parent.update({
        where: { id },
        data: {
          firstName: dto.firstName, lastName: dto.lastName, gender: dto.gender,
          phone: dto.phone, email: dto.email || null, occupation: dto.occupation,
          address: dto.address, profilePhoto: dto.profilePhoto,
        },
      });
    });
    return this.findOne(id);
  }

  private async updateParentRecord(id: string, updateParentDto: UpdateParentDto) {
    const parent = await this.prisma.parent.findUnique({ where: { id } });
    if (!parent) throw new NotFoundException('Parent profile not found.');

    const data: Record<string, unknown> = {};
    if (updateParentDto.firstName !== undefined) data.firstName = updateParentDto.firstName;
    if (updateParentDto.lastName !== undefined) data.lastName = updateParentDto.lastName;
    if (updateParentDto.gender !== undefined) data.gender = updateParentDto.gender;
    if (updateParentDto.phone !== undefined) data.phone = updateParentDto.phone;
    if (updateParentDto.address !== undefined) data.address = updateParentDto.address;
    if (updateParentDto.occupation !== undefined) data.occupation = updateParentDto.occupation;
    if (updateParentDto.profilePhoto !== undefined) data.profilePhoto = updateParentDto.profilePhoto;
    if (updateParentDto.relationship !== undefined) data.relationship = updateParentDto.relationship;
    if (updateParentDto.identityDocumentType !== undefined) data.identityDocumentType = updateParentDto.identityDocumentType;
    if (updateParentDto.identityDocumentUrl !== undefined) data.identityDocumentUrl = updateParentDto.identityDocumentUrl;

    if (updateParentDto.email !== undefined) {
      data.email = updateParentDto.email;
    }

    return this.prisma.parent.update({
      where: { id: parent.id },
      data,
      include: {
        user: { select: { id: true, email: true, username: true, isActive: true } },
      },
    });
  }

  async getMyFinance(userId: string) {
    const parent = await this.findByUserId(userId);
    return parent.students.map((relation) => ({
      student: {
        id: relation.student.id,
        admissionNumber: relation.student.admissionNumber,
        firstName: relation.student.firstName,
        lastName: relation.student.lastName,
      },
      finance: this.buildStudentDashboard(relation.student).finance,
    }));
  }

  async createPortalAccount(parentId: string, requestedEmail?: string) {
    const parent = await this.prisma.parent.findUnique({
      where: { id: parentId },
      include: { user: true },
    });
    if (!parent) throw new NotFoundException('Parent not found.');
    if (parent.userId || parent.user) {
      throw new BadRequestException('This guardian already has a portal account.');
    }

    const role = await this.prisma.role.findUnique({ where: { name: 'PARENT' } });
    if (!role) throw new BadRequestException('PARENT role is not configured.');

    const loginEmail = requestedEmail?.trim().toLowerCase()
      ?? await this.generateUniqueLoginEmail(parent.firstName, parent.lastName);
    const existingUser = await this.prisma.user.findUnique({ where: { email: loginEmail } });
    if (existingUser) throw new BadRequestException('That login email is already in use.');

    const temporaryPassword = generateTempPassword();
    const password = await bcrypt.hash(temporaryPassword, 12);
    const user = await this.prisma.user.create({
      data: {
        email: loginEmail,
        password,
        parent: { connect: { id: parent.id } },
        roles: { create: { roleId: role.id } },
      },
      select: { id: true, email: true, username: true, isActive: true, isLoggedIn: true, lastLogin: true },
    });

    return { user, temporaryPassword };
  }

  async resetPortalPassword(parentId: string) {
    const parent = await this.prisma.parent.findUnique({
      where: { id: parentId },
      select: { userId: true },
    });
    if (!parent) throw new NotFoundException('Parent not found.');
    if (!parent.userId) throw new BadRequestException('This guardian does not have a portal account.');

    const temporaryPassword = generateTempPassword();
    const user = await this.prisma.user.update({
      where: { id: parent.userId },
      data: { password: await bcrypt.hash(temporaryPassword, 12), isLoggedIn: false },
      select: { id: true, email: true, isActive: true, isLoggedIn: true, lastLogin: true },
    });
    return { user, temporaryPassword };
  }

  async updatePortalStatus(parentId: string, isActive: boolean) {
    const parent = await this.prisma.parent.findUnique({
      where: { id: parentId },
      select: { userId: true },
    });
    if (!parent) throw new NotFoundException('Parent not found.');
    if (!parent.userId) throw new BadRequestException('This guardian does not have a portal account.');

    return this.prisma.user.update({
      where: { id: parent.userId },
      data: { isActive, ...(isActive ? {} : { isLoggedIn: false }) },
      select: { id: true, email: true, username: true, isActive: true, isLoggedIn: true, lastLogin: true },
    });
  }

  async linkStudent(parentId: string, input: { studentId: string; relationship?: string; isPrimary?: boolean }) {
    const [parent, student] = await Promise.all([
      this.prisma.parent.findUnique({ where: { id: parentId }, select: { id: true } }),
      this.prisma.student.findUnique({ where: { id: input.studentId }, select: { id: true } }),
    ]);
    if (!parent) throw new NotFoundException('Parent not found.');
    if (!student) throw new NotFoundException('Student not found.');

    return this.prisma.$transaction(async (tx) => {
      if (input.isPrimary) {
        await tx.studentParent.updateMany({
          where: { studentId: input.studentId },
          data: { isPrimary: false },
        });
      }
      return tx.studentParent.upsert({
        where: { studentId_parentId: { studentId: input.studentId, parentId } },
        create: {
          studentId: input.studentId,
          parentId,
          relationship: input.relationship,
          isPrimary: input.isPrimary ?? false,
        },
        update: {
          relationship: input.relationship,
          isPrimary: input.isPrimary ?? false,
          isActive: true,
          unlinkedAt: null,
          unlinkedByUserId: null,
          unlinkReason: null,
        },
        include: { student: { include: { schoolClass: true, academicYear: true, term: true } } },
      });
    });
  }

  async unlinkStudent(parentId: string, studentId: string, unlinkedByUserId?: string, reason?: string) {
    const relation = await this.prisma.studentParent.findUnique({
      where: { studentId_parentId: { studentId, parentId } },
    });
    if (!relation || !relation.isActive) throw new NotFoundException('This child is not actively linked to the guardian.');
    const activeRelationships = await this.prisma.studentParent.count({
      where: { parentId, isActive: true },
    });
    if (activeRelationships <= 1) {
      throw new BadRequestException('Link another student before removing the guardian’s final active relationship, or archive the guardian.');
    }
    await this.prisma.studentParent.update({
      where: { id: relation.id },
      data: {
        isActive: false,
        isPrimary: false,
        unlinkedAt: new Date(),
        unlinkedByUserId,
        unlinkReason: reason?.trim() || null,
      },
    });
    return { message: 'Child unlinked successfully.' };
  }

  async addDocument(parentId: string, document: {
    documentCategoryId: string;
    originalFileName: string;
    fileUrl: string;
    title?: string;
    mimeType?: string;
    fileExtension?: string;
    fileSize?: number;
  }, uploadedByUserId?: string) {
    const [parent, category] = await Promise.all([
      this.prisma.parent.findUnique({ where: { id: parentId }, select: { id: true } }),
      this.prisma.documentCategory.findFirst({
        where: { id: document.documentCategoryId, entityType: 'PARENT', isActive: true },
      }),
    ]);
    if (!parent) throw new NotFoundException('Parent not found.');
    if (!category) throw new BadRequestException('Invalid guardian document category.');
    return this.prisma.document.create({
      data: {
        entityType: 'PARENT', entityId: parentId,
        documentCategoryId: document.documentCategoryId,
        originalFileName: document.originalFileName,
        fileUrl: document.fileUrl,
        title: document.title,
        mimeType: document.mimeType,
        fileExtension: document.fileExtension,
        fileSize: document.fileSize,
        uploadedByUserId,
      },
      include: { documentCategory: true },
    });
  }

  async removeDocument(parentId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, entityType: 'PARENT', entityId: parentId, isActive: true },
    });
    if (!document) throw new NotFoundException('Guardian document not found.');
    await this.prisma.document.update({ where: { id: document.id }, data: { isActive: false } });
    return { message: 'Document removed successfully.' };
  }

  async remove(id: string, archivedByUserId?: string) {
    const parent = await this.prisma.parent.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    if (!parent) throw new NotFoundException('Parent not found.');

    return this.prisma.$transaction(async (tx) => {
      await tx.studentParent.updateMany({
        where: { parentId: id, isActive: true },
        data: { isActive: false, isPrimary: false, unlinkedAt: new Date(), unlinkedByUserId: archivedByUserId, unlinkReason: 'Guardian archived' },
      });
      const archived = await tx.parent.update({
        where: { id },
        data: { isActive: false, archivedAt: new Date(), archivedByUserId },
      });
      if (parent.userId) {
        await tx.user.update({ where: { id: parent.userId }, data: { isActive: false, isLoggedIn: false } });
      }
      return archived;
    });
  }

  private async generateUniqueLoginEmail(firstName: string, lastName: string) {
    const clean = (value: string) => value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '.')
      .replace(/^\.|\.$/g, '');
    const base = `${clean(firstName) || 'guardian'}.${clean(lastName) || 'parent'}.guardian`;
    let candidate = `${base}@mhs.com`;
    let suffix = 2;
    while (await this.prisma.user.findUnique({ where: { email: candidate }, select: { id: true } })) {
      candidate = `${base}${suffix}@mhs.com`;
      suffix += 1;
    }
    return candidate;
  }
}
