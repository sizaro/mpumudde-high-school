import { FinanceService } from './finance.service.js';
import { CreateFinanceDto } from './dto/create-finance.dto.js';
import { UpdateFinanceDto } from './dto/update-finance.dto.js';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    create(createFinanceDto: CreateFinanceDto): Promise<{
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
            academicYearId: string | null;
            termId: string | null;
            classId: string | null;
            studentCategoryId: string | null;
        };
        financeStructure: ({
            academicYear: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
            term: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                academicYearId: string;
                feeAmount: number;
                startDate: Date | null;
                endDate: Date | null;
            };
            schoolClass: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
            studentCategory: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
            feeType: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            academicYearId: string;
            termId: string;
            classId: string;
            studentCategoryId: string;
            feeTypeId: string;
            expectedAmount: number;
        }) | null;
        studentTermFee: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            termId: string;
            studentId: string;
            amountOwed: number;
            amountPaid: number;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        studentId: string;
        studentTermFeeId: string | null;
        financeStructureId: string | null;
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
            academicYearId: string | null;
            termId: string | null;
            classId: string | null;
            studentCategoryId: string | null;
        };
        studentTermFee: ({
            term: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                academicYearId: string;
                feeAmount: number;
                startDate: Date | null;
                endDate: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            termId: string;
            studentId: string;
            amountOwed: number;
            amountPaid: number;
        }) | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        studentId: string;
        studentTermFeeId: string | null;
        financeStructureId: string | null;
        amount: number;
        method: string;
        status: string;
        date: Date;
    })[]>;
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
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    academicYearId: string;
                    feeAmount: number;
                    startDate: Date | null;
                    endDate: Date | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                termId: string;
                studentId: string;
                amountOwed: number;
                amountPaid: number;
            }) | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            studentId: string;
            studentTermFeeId: string | null;
            financeStructureId: string | null;
            amount: number;
            method: string;
            status: string;
            date: Date;
        })[];
    } | null>;
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
            academicYearId: string | null;
            termId: string | null;
            classId: string | null;
            studentCategoryId: string | null;
        };
        studentTermFee: ({
            term: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                academicYearId: string;
                feeAmount: number;
                startDate: Date | null;
                endDate: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            termId: string;
            studentId: string;
            amountOwed: number;
            amountPaid: number;
        }) | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        studentId: string;
        studentTermFeeId: string | null;
        financeStructureId: string | null;
        amount: number;
        method: string;
        status: string;
        date: Date;
    }) | null>;
    update(id: string, updateFinanceDto: UpdateFinanceDto): Promise<{
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
            academicYearId: string | null;
            termId: string | null;
            classId: string | null;
            studentCategoryId: string | null;
        };
        studentTermFee: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            termId: string;
            studentId: string;
            amountOwed: number;
            amountPaid: number;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        studentId: string;
        studentTermFeeId: string | null;
        financeStructureId: string | null;
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
        studentTermFeeId: string | null;
        financeStructureId: string | null;
        amount: number;
        method: string;
        status: string;
        date: Date;
    }>;
}
