import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(createStudentDto: CreateStudentDto): Promise<{
        academicYear: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        } | null;
        term: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            academicYearId: string;
            name: string;
            feeAmount: number;
            startDate: Date | null;
            endDate: Date | null;
        } | null;
        schoolClass: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        } | null;
        studentCategory: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        } | null;
    } & {
        id: string;
        admissionNumber: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        gender: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        academicYearId: string | null;
        termId: string | null;
        classId: string | null;
        studentCategoryId: string | null;
    }>;
    findAll(): Promise<({
        academicYear: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        } | null;
        term: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            academicYearId: string;
            name: string;
            feeAmount: number;
            startDate: Date | null;
            endDate: Date | null;
        } | null;
        schoolClass: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        } | null;
        studentCategory: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        } | null;
        parents: {
            id: string;
            createdAt: Date;
            studentId: string;
            parentId: string;
            relationship: string | null;
        }[];
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            studentTermFeeId: string | null;
            financeStructureId: string | null;
            amount: number;
            method: string;
            status: string;
            description: string | null;
            date: Date;
        }[];
    } & {
        id: string;
        admissionNumber: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        gender: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        academicYearId: string | null;
        termId: string | null;
        classId: string | null;
        studentCategoryId: string | null;
    })[]>;
    findOne(id: string): Promise<({
        academicYear: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        } | null;
        term: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            academicYearId: string;
            name: string;
            feeAmount: number;
            startDate: Date | null;
            endDate: Date | null;
        } | null;
        schoolClass: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        } | null;
        studentCategory: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        } | null;
        parents: {
            id: string;
            createdAt: Date;
            studentId: string;
            parentId: string;
            relationship: string | null;
        }[];
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            studentTermFeeId: string | null;
            financeStructureId: string | null;
            amount: number;
            method: string;
            status: string;
            description: string | null;
            date: Date;
        }[];
    } & {
        id: string;
        admissionNumber: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        gender: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        academicYearId: string | null;
        termId: string | null;
        classId: string | null;
        studentCategoryId: string | null;
    }) | null>;
    getFinanceSummary(id: string): Promise<{
        student: {
            id: string;
            admissionNumber: string;
            firstName: string;
            lastName: string;
            academicYear: string | undefined;
            term: string | undefined;
            className: string | undefined;
            studentCategory: string | undefined;
        };
        summary: {
            feeType: string;
            expectedAmount: number;
            paidAmount: number;
            balance: number;
            financeStructureId: string;
        }[];
        totalExpected: number;
        totalPaid: number;
        totalBalance: number;
    } | null>;
    update(id: string, updateStudentDto: UpdateStudentDto): Promise<{
        academicYear: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        } | null;
        term: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            academicYearId: string;
            name: string;
            feeAmount: number;
            startDate: Date | null;
            endDate: Date | null;
        } | null;
        schoolClass: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        } | null;
        studentCategory: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        } | null;
    } & {
        id: string;
        admissionNumber: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        gender: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        academicYearId: string | null;
        termId: string | null;
        classId: string | null;
        studentCategoryId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        admissionNumber: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        gender: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        academicYearId: string | null;
        termId: string | null;
        classId: string | null;
        studentCategoryId: string | null;
    }>;
}
