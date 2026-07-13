import { ParentsService } from './parents.service.js';
import { CreateParentDto } from './dto/create-parent.dto.js';
import { UpdateParentDto } from './dto/update-parent.dto.js';
export declare class ParentsController {
    private readonly parentsService;
    constructor(parentsService: ParentsService);
    create(createParentDto: CreateParentDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateParentDto: UpdateParentDto): string;
    remove(id: string): string;
}
