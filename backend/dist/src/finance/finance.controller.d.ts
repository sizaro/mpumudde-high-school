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
            isActive: boolean;
            admissionNumber: string;
            firstName: string;
            lastName: string;
            dateOfBirth: Date | null;
            gender: string | null;
        };
        studentTermFee: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            termId: string;
            amountOwed: number;
            amountPaid: number;
        } | null;
    } & {
        id: string;
        amount: number;
        method: string;
        status: string;
        description: string | null;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        studentTermFeeId: string | null;
    }>;
    findAll(): Promise<({
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            admissionNumber: string;
            firstName: string;
            lastName: string;
            dateOfBirth: Date | null;
            gender: string | null;
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            termId: string;
            amountOwed: number;
            amountPaid: number;
        }) | null;
    } & {
        id: string;
        amount: number;
        method: string;
        status: string;
        description: string | null;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        studentTermFeeId: string | null;
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
                    feeAmount: number;
                    startDate: Date;
                    endDate: Date;
                    isActive: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                studentId: string;
                termId: string;
                amountOwed: number;
                amountPaid: number;
            }) | null;
        } & {
            id: string;
            amount: number;
            method: string;
            status: string;
            description: string | null;
            date: Date;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            studentTermFeeId: string | null;
        })[];
    } | null>;
    findOne(id: string): Promise<({
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            admissionNumber: string;
            firstName: string;
            lastName: string;
            dateOfBirth: Date | null;
            gender: string | null;
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            termId: string;
            amountOwed: number;
            amountPaid: number;
        }) | null;
    } & {
        id: string;
        amount: number;
        method: string;
        status: string;
        description: string | null;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        studentTermFeeId: string | null;
    }) | null>;
    update(id: string, updateFinanceDto: UpdateFinanceDto): Promise<{
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            admissionNumber: string;
            firstName: string;
            lastName: string;
            dateOfBirth: Date | null;
            gender: string | null;
        };
        studentTermFee: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            termId: string;
            amountOwed: number;
            amountPaid: number;
        } | null;
    } & {
        id: string;
        amount: number;
        method: string;
        status: string;
        description: string | null;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        studentTermFeeId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        amount: number;
        method: string;
        status: string;
        description: string | null;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        studentTermFeeId: string | null;
    }>;
}
