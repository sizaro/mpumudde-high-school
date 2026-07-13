var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let FinanceService = class FinanceService {
    create(createFinanceDto) {
        return 'This action adds a new finance';
    }
    findAll() {
        return `This action returns all finance`;
    }
    findOne(id) {
        return `This action returns a #${id} finance`;
    }
    update(id, updateFinanceDto) {
        return `This action updates a #${id} finance`;
    }
    remove(id) {
        return `This action removes a #${id} finance`;
    }
};
FinanceService = __decorate([
    Injectable()
], FinanceService);
export { FinanceService };
//# sourceMappingURL=finance.service.js.map