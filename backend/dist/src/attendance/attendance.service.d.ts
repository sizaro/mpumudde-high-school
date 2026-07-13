import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';
export declare class AttendanceService {
    create(createAttendanceDto: CreateAttendanceDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAttendanceDto: UpdateAttendanceDto): string;
    remove(id: number): string;
}
