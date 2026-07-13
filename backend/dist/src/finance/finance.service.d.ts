import { CreateFinanceDto } from './dto/create-finance.dto.js';
import { UpdateFinanceDto } from './dto/update-finance.dto.js';
export declare class FinanceService {
    create(createFinanceDto: CreateFinanceDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateFinanceDto: UpdateFinanceDto): string;
    remove(id: number): string;
}
