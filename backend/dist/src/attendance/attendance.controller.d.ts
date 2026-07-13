import { AttendanceService } from './attendance.service.js';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    create(createAttendanceDto: CreateAttendanceDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateAttendanceDto: UpdateAttendanceDto): string;
    remove(id: string): string;
}
