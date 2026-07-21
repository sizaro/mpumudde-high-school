import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(createStudentDto: CreateStudentDto): Promise<{
        admissionNumber: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        gender: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
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
            amount: number;
            method: string;
            status: string;
            description: string | null;
            date: Date;
        }[];
    } & {
        admissionNumber: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        gender: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<({
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
            amount: number;
            method: string;
            status: string;
            description: string | null;
            date: Date;
        }[];
    } & {
        admissionNumber: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        gender: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    update(id: string, updateStudentDto: UpdateStudentDto): Promise<{
        admissionNumber: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        gender: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        admissionNumber: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date | null;
        gender: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
