var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let TeachersService = class TeachersService {
    create(createTeacherDto) {
        return 'This action adds a new teacher';
    }
    findAll() {
        return `This action returns all teachers`;
    }
    findOne(id) {
        return `This action returns a #${id} teacher`;
    }
    update(id, updateTeacherDto) {
        return `This action updates a #${id} teacher`;
    }
    remove(id) {
        return `This action removes a #${id} teacher`;
    }
};
TeachersService = __decorate([
    Injectable()
], TeachersService);
export { TeachersService };
//# sourceMappingURL=teachers.service.js.map