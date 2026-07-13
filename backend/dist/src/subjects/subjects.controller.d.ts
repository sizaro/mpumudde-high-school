import { SubjectsService } from './subjects.service.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';
export declare class SubjectsController {
    private readonly subjectsService;
    constructor(subjectsService: SubjectsService);
    create(createSubjectDto: CreateSubjectDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateSubjectDto: UpdateSubjectDto): string;
    remove(id: string): string;
}
