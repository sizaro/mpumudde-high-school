import { FinanceService } from './finance.service.js';
import { CreateFinanceDto } from './dto/create-finance.dto.js';
import { UpdateFinanceDto } from './dto/update-finance.dto.js';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    create(createFinanceDto: CreateFinanceDto): Promise<{
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            termId: string | null;
            academicYearId: string | null;
            isActive: boolean;
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
                academicYearId: string;
                feeAmount: number;
                startDate: Date | null;
                endDate: Date | null;
                isActive: boolean;
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
            academicYearId: string | null;
            isActive: boolean;
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
                academicYearId: string;
                feeAmount: number;
                startDate: Date | null;
                endDate: Date | null;
                isActive: boolean;
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
                    academicYearId: string;
                    feeAmount: number;
                    startDate: Date | null;
                    endDate: Date | null;
                    isActive: boolean;
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
    findOne(id: string): Promise<({
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            termId: string | null;
            academicYearId: string | null;
            isActive: boolean;
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
                academicYearId: string;
                feeAmount: number;
                startDate: Date | null;
                endDate: Date | null;
                isActive: boolean;
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
            academicYearId: string | null;
            isActive: boolean;
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
}
