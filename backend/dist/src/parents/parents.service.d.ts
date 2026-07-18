import { CreateParentDto } from './dto/create-parent.dto.js';
import { UpdateParentDto } from './dto/update-parent.dto.js';
export declare class ParentsService {
    create(createParentDto: CreateParentDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateParentDto: UpdateParentDto): string;
    remove(id: number): string;
}
