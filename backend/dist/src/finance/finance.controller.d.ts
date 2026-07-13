import { FinanceService } from './finance.service.js';
import { CreateFinanceDto } from './dto/create-finance.dto.js';
import { UpdateFinanceDto } from './dto/update-finance.dto.js';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    create(createFinanceDto: CreateFinanceDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateFinanceDto: UpdateFinanceDto): string;
    remove(id: string): string;
}
