var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let StudentsService = class StudentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createStudentDto) {
        return this.prisma.student.create({
            data: {
                admissionNumber: createStudentDto.admissionNumber,
                firstName: createStudentDto.firstName,
                lastName: createStudentDto.lastName,
                dateOfBirth: createStudentDto.dateOfBirth ? new Date(createStudentDto.dateOfBirth) : undefined,
                gender: createStudentDto.gender,
                isActive: createStudentDto.isActive ?? true,
                academicYearId: createStudentDto.academicYearId,
                termId: createStudentDto.termId,
                classId: createStudentDto.classId,
                studentCategoryId: createStudentDto.studentCategoryId,
            },
            include: {
                academicYear: true,
                term: true,
                schoolClass: true,
                studentCategory: true,
            },
        });
    }
    async findAll() {
        return this.prisma.student.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                parents: true,
                payments: true,
                academicYear: true,
                term: true,
                schoolClass: true,
                studentCategory: true,
            },
        });
    }
    async findOne(id) {
        return this.prisma.student.findUnique({
            where: { id },
            include: {
                parents: true,
                payments: true,
                academicYear: true,
                term: true,
                schoolClass: true,
                studentCategory: true,
            },
        });
    }
    async update(id, updateStudentDto) {
        return this.prisma.student.update({
            where: { id },
            data: {
                admissionNumber: updateStudentDto.admissionNumber,
                firstName: updateStudentDto.firstName,
                lastName: updateStudentDto.lastName,
                dateOfBirth: updateStudentDto.dateOfBirth ? new Date(updateStudentDto.dateOfBirth) : undefined,
                gender: updateStudentDto.gender,
                isActive: updateStudentDto.isActive,
                academicYearId: updateStudentDto.academicYearId,
                termId: updateStudentDto.termId,
                classId: updateStudentDto.classId,
                studentCategoryId: updateStudentDto.studentCategoryId,
            },
            include: {
                academicYear: true,
                term: true,
                schoolClass: true,
                studentCategory: true,
            },
        });
    }
    async remove(id) {
        return this.prisma.student.delete({
            where: { id },
        });
    }
    async getFinanceSummary(id) {
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
};
StudentsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], StudentsService);
export { StudentsService };
//# sourceMappingURL=students.service.js.map