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
import { SetupModule } from './setup/setup.module.js';

import { PrismaModule } from './prisma/prisma.module.js';

@Module({
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
    SetupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}