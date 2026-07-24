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
let FinanceService = class FinanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createFinanceDto) {
        let studentTermFeeId = createFinanceDto.studentTermFeeId;
        if (!studentTermFeeId) {
            const activeTerm = await this.prisma.term.findFirst({
                where: { isActive: true },
            });
            if (activeTerm) {
                const studentTermFee = await this.prisma.studentTermFee.findUnique({
                    where: {
                        studentId_termId: {
                            studentId: createFinanceDto.studentId,
                            termId: activeTerm.id,
                        },
                    },
                });
                if (studentTermFee) {
                    studentTermFeeId = studentTermFee.id;
                }
            }
        }
        const payment = await this.prisma.payment.create({
            data: {
                studentId: createFinanceDto.studentId,
                studentTermFeeId: studentTermFeeId || undefined,
                financeStructureId: createFinanceDto.financeStructureId || undefined,
                amount: createFinanceDto.amount,
                method: createFinanceDto.method,
                status: createFinanceDto.status ?? 'completed',
                description: createFinanceDto.description,
                date: createFinanceDto.date ? new Date(createFinanceDto.date) : undefined,
            },
            include: {
                student: true,
                studentTermFee: true,
                financeStructure: {
                    include: {
                        academicYear: true,
                        term: true,
                        schoolClass: true,
                        studentCategory: true,
                        feeType: true,
                    },
                },
            },
        });
        if (studentTermFeeId) {
            await this.prisma.studentTermFee.update({
                where: { id: studentTermFeeId },
                data: {
                    amountPaid: {
                        increment: createFinanceDto.amount,
                    },
                },
            });
        }
        return payment;
    }
    async findAll() {
        return this.prisma.payment.findMany({
            orderBy: { date: 'desc' },
            include: {
                student: true,
                studentTermFee: { include: { term: true } },
            },
        });
    }
    async findOne(id) {
        return this.prisma.payment.findUnique({
            where: { id },
            include: {
                student: true,
                studentTermFee: { include: { term: true } },
            },
        });
    }
    async update(id, updateFinanceDto) {
        return this.prisma.payment.update({
            where: { id },
            data: {
                amount: updateFinanceDto.amount,
                method: updateFinanceDto.method,
                status: updateFinanceDto.status,
                description: updateFinanceDto.description,
                date: updateFinanceDto.date ? new Date(updateFinanceDto.date) : undefined,
            },
            include: { student: true, studentTermFee: true },
        });
    }
    async remove(id) {
        return this.prisma.payment.delete({
            where: { id },
        });
    }
    async getStudentsWithBalances() {
        const students = await this.prisma.student.findMany({
            include: {
                termFees: {
                    include: { term: true },
                    where: { term: { isActive: true } },
                },
                payments: true,
            },
        });
        return students.map((student) => {
            if (student.termFees.length === 0) {
                return {
                    id: student.id,
                    admissionNumber: student.admissionNumber,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    isActive: student.isActive,
                    balances: [],
                    totalOwed: 0,
                    totalPaid: 0,
                    totalBalance: 0,
                };
            }
            const balances = student.termFees.map((tf) => ({
                termId: tf.termId,
                termName: tf.term.name,
                amountOwed: tf.amountOwed,
                amountPaid: tf.amountPaid,
                balance: tf.amountOwed - tf.amountPaid,
            }));
            const totalOwed = balances.reduce((sum, b) => sum + b.amountOwed, 0);
            const totalPaid = balances.reduce((sum, b) => sum + b.amountPaid, 0);
            const totalBalance = totalOwed - totalPaid;
            return {
                id: student.id,
                admissionNumber: student.admissionNumber,
                firstName: student.firstName,
                lastName: student.lastName,
                isActive: student.isActive,
                balances,
                totalOwed,
                totalPaid,
                totalBalance,
            };
        });
    }
    async getStudentBalance(studentId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: {
                termFees: {
                    include: { term: true },
                    where: { term: { isActive: true } },
                },
                payments: {
                    include: { studentTermFee: { include: { term: true } } },
                },
            },
        });
        if (!student)
            return null;
        const balances = student.termFees.map((tf) => ({
            termId: tf.termId,
            termName: tf.term.name,
            amountOwed: tf.amountOwed,
            amountPaid: tf.amountPaid,
            balance: tf.amountOwed - tf.amountPaid,
        }));
        const totalOwed = balances.reduce((sum, b) => sum + b.amountOwed, 0);
        const totalPaid = balances.reduce((sum, b) => sum + b.amountPaid, 0);
        const totalBalance = totalOwed - totalPaid;
        return {
            id: student.id,
            admissionNumber: student.admissionNumber,
            firstName: student.firstName,
            lastName: student.lastName,
            isActive: student.isActive,
            balances,
            totalOwed,
            totalPaid,
            totalBalance,
            recentPayments: student.payments.slice(0, 5),
        };
    }
};
FinanceService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], FinanceService);
export { FinanceService };
//# sourceMappingURL=finance.service.js.map