var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateFinanceDto {
    studentId;
    studentTermFeeId;
    amount;
    method;
    status;
    description;
    date;
    financeStructureId;
    feeTypeId;
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateFinanceDto.prototype, "studentId", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateFinanceDto.prototype, "studentTermFeeId", void 0);
__decorate([
    Type(() => Number),
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], CreateFinanceDto.prototype, "amount", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateFinanceDto.prototype, "method", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateFinanceDto.prototype, "status", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateFinanceDto.prototype, "description", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateFinanceDto.prototype, "date", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateFinanceDto.prototype, "financeStructureId", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateFinanceDto.prototype, "feeTypeId", void 0);
//# sourceMappingURL=create-finance.dto.js.map