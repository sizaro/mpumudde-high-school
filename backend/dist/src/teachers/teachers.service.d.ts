import { CreateTeacherDto } from './dto/create-teacher.dto.js';
import { UpdateTeacherDto } from './dto/update-teacher.dto.js';
export declare class TeachersService {
    create(createTeacherDto: CreateTeacherDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateTeacherDto: UpdateTeacherDto): string;
    remove(id: number): string;
}
