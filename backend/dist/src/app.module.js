var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { StudentsModule } from './students/students.module.js';
import { ParentsModule } from './parents/parents.module.js';
import { TeachersModule } from './teachers/teachers.module.js';
import { ClassesModule } from './classes/classes.module.js';
import { SubjectsModule } from './subjects/subjects.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
import { FinanceModule } from './finance/finance.module.js';
import { UsersModule } from './users/users.module.js';
import { RolesModule } from './roles/roles.module.js';
import { TeachingAssignmentsModule } from './teaching-assignments/teaching-assignments.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            PrismaModule,
            AuthModule,
            StudentsModule,
            ParentsModule,
            TeachersModule,
            ClassesModule,
            SubjectsModule,
            AttendanceModule,
            FinanceModule,
            UsersModule,
            RolesModule,
            TeachingAssignmentsModule,
            DashboardModule,
        ],
        controllers: [AppController],
        providers: [AppService],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map