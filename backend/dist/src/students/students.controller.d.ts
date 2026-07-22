import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(createStudentDto: CreateStudentDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        admissionNumber: string;
        dateOfBirth: Date | null;
        gender: string | null;
    }>;
    findAll(): Promise<({
        parents: {
            id: string;
            createdAt: Date;
            relationship: string | null;
            studentId: string;
            parentId: string;
        }[];
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            studentId: string;
            studentTermFeeId: string | null;
            amount: number;
            method: string;
            status: string;
            date: Date;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        admissionNumber: string;
        dateOfBirth: Date | null;
        gender: string | null;
    })[]>;
    findOne(id: string): Promise<({
        parents: {
            id: string;
            createdAt: Date;
            relationship: string | null;
            studentId: string;
            parentId: string;
        }[];
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            studentId: string;
            studentTermFeeId: string | null;
            amount: number;
            method: string;
            status: string;
            date: Date;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        admissionNumber: string;
        dateOfBirth: Date | null;
        gender: string | null;
    }) | null>;
    update(id: string, updateStudentDto: UpdateStudentDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        admissionNumber: string;
        dateOfBirth: Date | null;
        gender: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        admissionNumber: string;
        dateOfBirth: Date | null;
        gender: string | null;
    }>;
}
