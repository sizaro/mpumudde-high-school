var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let ParentsService = class ParentsService {
    create(createParentDto) {
        return 'This action adds a new parent';
    }
    findAll() {
        return `This action returns all parents`;
    }
    findOne(id) {
        return `This action returns a #${id} parent`;
    }
    update(id, updateParentDto) {
        return `This action updates a #${id} parent`;
    }
    remove(id) {
        return `This action removes a #${id} parent`;
    }
};
ParentsService = __decorate([
    Injectable()
], ParentsService);
export { ParentsService };
//# sourceMappingURL=parents.service.js.map