import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { ParentsModule } from './parents/parents.module';
import { TeachersModule } from './teachers/teachers.module';
import { ClassesModule } from './classes/classes.module';
import { SubjectsModule } from './subjects/subjects.module';
import { AttendanceModule } from './attendance/attendance.module';
import { FinanceModule } from './finance/finance.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TeachingAssignmentsModule } from './teaching-assignments/teaching-assignments.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [AuthModule, StudentsModule, ParentsModule, TeachersModule, ClassesModule, SubjectsModule, AttendanceModule, FinanceModule, UsersModule, RolesModule, TeachingAssignmentsModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
