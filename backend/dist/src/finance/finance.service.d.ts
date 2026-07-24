import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFinanceDto } from './dto/create-finance.dto.js';
import { UpdateFinanceDto } from './dto/update-finance.dto.js';
export declare class FinanceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createFinanceDto: CreateFinanceDto): Promise<{
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            termId: string | null;
            isActive: boolean;
            academicYearId: string | null;
            admissionNumber: string;
            firstName: string;
            lastName: string;
            dateOfBirth: Date | null;
            gender: string | null;
            classId: string | null;
            studentCategoryId: string | null;
        };
        studentTermFee: {
            studentId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            termId: string;
            amountOwed: number;
            amountPaid: number;
        } | null;
        financeStructure: ({
            term: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                feeAmount: number;
                startDate: Date;
                endDate: Date;
                isActive: boolean;
                academicYearId: string | null;
            };
            academicYear: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
            };
            schoolClass: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
            };
            studentCategory: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
            };
            feeType: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
            };
        } & {
            feeTypeId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            termId: string;
            academicYearId: string;
            classId: string;
            studentCategoryId: string;
            expectedAmount: number;
        }) | null;
    } & {
        studentId: string;
        studentTermFeeId: string | null;
        amount: number;
        method: string;
        status: string;
        description: string | null;
        date: Date;
        financeStructureId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            termId: string | null;
            isActive: boolean;
            academicYearId: string | null;
            admissionNumber: string;
            firstName: string;
            lastName: string;
            dateOfBirth: Date | null;
            gender: string | null;
            classId: string | null;
            studentCategoryId: string | null;
        };
        studentTermFee: ({
            term: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                feeAmount: number;
                startDate: Date;
                endDate: Date;
                isActive: boolean;
                academicYearId: string | null;
            };
        } & {
            studentId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            termId: string;
            amountOwed: number;
            amountPaid: number;
        }) | null;
    } & {
        studentId: string;
        studentTermFeeId: string | null;
        amount: number;
        method: string;
        status: string;
        description: string | null;
        date: Date;
        financeStructureId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<({
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            termId: string | null;
            isActive: boolean;
            academicYearId: string | null;
            admissionNumber: string;
            firstName: string;
            lastName: string;
            dateOfBirth: Date | null;
            gender: string | null;
            classId: string | null;
            studentCategoryId: string | null;
        };
        studentTermFee: ({
            term: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                feeAmount: number;
                startDate: Date;
                endDate: Date;
                isActive: boolean;
                academicYearId: string | null;
            };
        } & {
            studentId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            termId: string;
            amountOwed: number;
            amountPaid: number;
        }) | null;
    } & {
        studentId: string;
        studentTermFeeId: string | null;
        amount: number;
        method: string;
        status: string;
        description: string | null;
        date: Date;
        financeStructureId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    update(id: string, updateFinanceDto: UpdateFinanceDto): Promise<{
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            termId: string | null;
            isActive: boolean;
            academicYearId: string | null;
            admissionNumber: string;
            firstName: string;
            lastName: string;
            dateOfBirth: Date | null;
            gender: string | null;
            classId: string | null;
            studentCategoryId: string | null;
        };
        studentTermFee: {
            studentId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            termId: string;
            amountOwed: number;
            amountPaid: number;
        } | null;
    } & {
        studentId: string;
        studentTermFeeId: string | null;
        amount: number;
        method: string;
        status: string;
        description: string | null;
        date: Date;
        financeStructureId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        studentId: string;
        studentTermFeeId: string | null;
        amount: number;
        method: string;
        status: string;
        description: string | null;
        date: Date;
        financeStructureId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getStudentsWithBalances(): Promise<{
        id: string;
        admissionNumber: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        balances: {
            termId: string;
            termName: string;
            amountOwed: number;
            amountPaid: number;
            balance: number;
        }[];
        totalOwed: number;
        totalPaid: number;
        totalBalance: number;
    }[]>;
    getStudentBalance(studentId: string): Promise<{
        id: string;
        admissionNumber: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        balances: {
            termId: string;
            termName: string;
            amountOwed: number;
            amountPaid: number;
            balance: number;
        }[];
        totalOwed: number;
        totalPaid: number;
        totalBalance: number;
        recentPayments: ({
            studentTermFee: ({
                term: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    feeAmount: number;
                    startDate: Date;
                    endDate: Date;
                    isActive: boolean;
                    academicYearId: string | null;
                };
            } & {
                studentId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                termId: string;
                amountOwed: number;
                amountPaid: number;
            }) | null;
        } & {
            studentId: string;
            studentTermFeeId: string | null;
            amount: number;
            method: string;
            status: string;
            description: string | null;
            date: Date;
            financeStructureId: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } | null>;
}
