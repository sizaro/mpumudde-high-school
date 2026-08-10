import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateAttendanceSessionDto } from "./dto/create-attendance-session.dto.js";

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeStatus(rawStatus: string) {
    const normalized = String(rawStatus ?? "")
      .trim()
      .toUpperCase();
    const allowed = new Set(["PRESENT", "ABSENT", "LATE", "EXCUSED"]);
    if (!allowed.has(normalized)) {
      throw new BadRequestException(
        "Attendance status must be Present, Absent, Late, or Excused",
      );
    }
    return normalized.charAt(0) + normalized.slice(1).toLowerCase();
  }

  async createSession(dto: CreateAttendanceSessionDto, userId: string) {
    const teacher = await this.prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) throw new NotFoundException("Teacher profile not found");

    const assignment = await this.prisma.teacherAssignment.findFirst({
      where: { teacherId: teacher.id, subjectId: dto.subjectId },
    });
    if (!assignment)
      throw new ForbiddenException(
        "Not assigned to this class/subject combination",
      );

    const studentIds = dto.records.map((r) => r.studentId);
    const students = await this.prisma.student.findMany({
      where: { classId: dto.classId, id: { in: studentIds } },
    });
    if (students.length !== studentIds.length)
      throw new BadRequestException(
        "One or more students do not belong to this class",
      );

    return this.prisma.attendanceSession.create({
      data: {
        teacherId: teacher.id,
        classId: dto.classId,
        subjectId: dto.subjectId,
        date: dto.date ? new Date(dto.date) : new Date(),
        records: {
          create: dto.records.map((r) => ({
            studentId: r.studentId,
            status: r.status,
          })),
        },
      },
      include: {
        teacher: { select: { id: true, firstName: true, lastName: true } },
        schoolClass: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
        records: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                admissionNumber: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.attendanceSession.findMany({
      orderBy: { date: "desc" },
      include: {
        teacher: { select: { id: true, firstName: true, lastName: true } },
        schoolClass: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
        _count: { select: { records: true } },
      },
    });
  }

  async findByTeacher(userId: string) {
    const teacher = await this.prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) throw new NotFoundException("Teacher profile not found");
    return this.prisma.attendanceSession.findMany({
      where: { teacherId: teacher.id },
      orderBy: { date: "desc" },
      include: {
        schoolClass: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
        records: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                admissionNumber: true,
              },
            },
          },
        },
      },
    });
  }

  async findByClass(classId: string) {
    return this.prisma.attendanceSession.findMany({
      where: { classId },
      orderBy: { date: "desc" },
      include: {
        teacher: { select: { id: true, firstName: true, lastName: true } },
        subject: { select: { id: true, name: true } },
        records: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                admissionNumber: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.attendanceSession.findUnique({
      where: { id },
      include: {
        teacher: { select: { id: true, firstName: true, lastName: true } },
        schoolClass: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
        records: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                admissionNumber: true,
              },
            },
          },
        },
      },
    });
    if (!session) throw new NotFoundException("Attendance session not found");
    return session;
  }

  async getStudentsForClass(classId: string) {
    return this.prisma.student.findMany({
      where: { classId, isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        admissionNumber: true,
        passportPhoto: true,
      },
      orderBy: { firstName: "asc" },
    });
  }

  async updateRecordStatus(
    sessionId: string,
    recordId: string,
    status: string,
  ) {
    const session = await this.prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      select: { id: true },
    });
    if (!session) throw new NotFoundException("Attendance session not found");

    const record = await this.prisma.attendanceRecord.findUnique({
      where: { id: recordId },
      select: { id: true, attendanceSessionId: true },
    });
    if (!record || record.attendanceSessionId !== sessionId) {
      throw new NotFoundException(
        "Attendance record not found in this session",
      );
    }

    return this.prisma.attendanceRecord.update({
      where: { id: recordId },
      data: { status: this.normalizeStatus(status) },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            admissionNumber: true,
          },
        },
        attendanceSession: {
          include: {
            schoolClass: { select: { id: true, name: true } },
            subject: { select: { id: true, name: true } },
            teacher: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });
  }

  async updateManyRecordStatuses(
    sessionId: string,
    updates: Array<{ recordId: string; status: string }>,
  ) {
    if (!updates.length) {
      throw new BadRequestException("Provide at least one attendance update.");
    }

    const session = await this.prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      select: { id: true },
    });
    if (!session) throw new NotFoundException("Attendance session not found");

    const recordIds = updates.map((item) => item.recordId);
    const uniqueRecordIds = Array.from(new Set(recordIds));
    if (uniqueRecordIds.length !== recordIds.length) {
      throw new BadRequestException(
        "Duplicate attendance record IDs were provided.",
      );
    }

    const existingRecords = await this.prisma.attendanceRecord.findMany({
      where: { id: { in: uniqueRecordIds } },
      select: { id: true, attendanceSessionId: true },
    });
    if (existingRecords.length !== uniqueRecordIds.length) {
      throw new NotFoundException(
        "One or more attendance records were not found.",
      );
    }

    if (
      existingRecords.some((record) => record.attendanceSessionId !== sessionId)
    ) {
      throw new BadRequestException(
        "One or more attendance records do not belong to this session.",
      );
    }

    await this.prisma.$transaction(
      updates.map((item) =>
        this.prisma.attendanceRecord.update({
          where: { id: item.recordId },
          data: { status: this.normalizeStatus(item.status) },
        }),
      ),
    );

    return this.findOne(sessionId);
  }
}
