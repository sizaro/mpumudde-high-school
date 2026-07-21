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
    async findOne(id) {
        return this.prisma.payment.findUnique({
            where: { id },
            include: { student: true },
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
        });
    }
    async remove(id) {
        return this.prisma.payment.delete({
            where: { id },
        });
    }
};
FinanceService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], FinanceService);
export { FinanceService };
//# sourceMappingURL=finance.service.js.map