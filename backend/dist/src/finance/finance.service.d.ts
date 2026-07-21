import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFinanceDto } from './dto/create-finance.dto.js';
import { UpdateFinanceDto } from './dto/update-finance.dto.js';
export declare class FinanceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createFinanceDto: CreateFinanceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        studentId: string;
        amount: number;
        method: string;
        status: string;
        date: Date;
    }>;
    findAll(): Promise<({
        student: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            admissionNumber: string;
            dateOfBirth: Date | null;
            gender: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        studentId: string;
        amount: number;
        method: string;
        status: string;
        date: Date;
    })[]>;
    findOne(id: string): Promise<({
        student: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            admissionNumber: string;
            dateOfBirth: Date | null;
            gender: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        studentId: string;
        amount: number;
        method: string;
        status: string;
        date: Date;
    }) | null>;
    update(id: string, updateFinanceDto: UpdateFinanceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        studentId: string;
        amount: number;
        method: string;
        status: string;
        date: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        studentId: string;
        amount: number;
        method: string;
        status: string;
        date: Date;
    }>;
}
