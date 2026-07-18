import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';
export declare class SubjectsService {
    create(createSubjectDto: CreateSubjectDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSubjectDto: UpdateSubjectDto): string;
    remove(id: number): string;
}
