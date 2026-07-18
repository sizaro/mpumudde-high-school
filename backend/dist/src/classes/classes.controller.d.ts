import { ClassesService } from './classes.service.js';
import { CreateClassDto } from './dto/create-class.dto.js';
import { UpdateClassDto } from './dto/update-class.dto.js';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    create(createClassDto: CreateClassDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateClassDto: UpdateClassDto): string;
    remove(id: string): string;
}
