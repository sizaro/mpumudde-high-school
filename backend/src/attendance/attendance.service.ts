import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateAttendanceSessionDto } from "./dto/create-attendance-session.dto.js";
import { NotificationsService } from "../notifications/notifications.service.js";
import { toKampalaLocalDateTime } from "../common/utils/kampala-date-time.js";

@Injectable()
export class AttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

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

    const academicYear = dto.academicYearId
      ? await this.prisma.academicYear.findUnique({ where: { id: dto.academicYearId } })
      : await this.prisma.academicYear.findFirst({ where: { status: "ACTIVE" } });
    if (!academicYear) throw new BadRequestException("No active academic year is configured.");
    const term = dto.termId
      ? await this.prisma.term.findFirst({ where: { id: dto.termId, academicYearId: academicYear.id } })
      : await this.prisma.term.findFirst({ where: { academicYearId: academicYear.id, status: "ACTIVE" } });
    if (!term) throw new BadRequestException("No active term is configured for this academic year.");
    const classOffering = await this.prisma.academicYearClass.findFirst({
      where: { academicYearId: academicYear.id, classId: dto.classId, isActive: true },
    });
    if (!classOffering) throw new BadRequestException("This class is not offered in the selected academic year.");
    const classSubject = await this.prisma.classSubject.findFirst({
      where: {
        id: dto.classSubjectId || undefined,
        academicYearClassId: classOffering.id,
        subjectId: dto.subjectId,
        isActive: true,
      },
    });
    if (!classSubject) throw new BadRequestException("This subject is not configured for the selected class and academic year.");

    const lessonLocal = toKampalaLocalDateTime(dto.date);
    const lessonDate = new Date(lessonLocal.slice(0, 10) + "T00:00:00");
    const assignmentDateWindow = {
      isActive: true,
      AND: [
        { OR: [{ startDate: null }, { startDate: { lte: lessonDate } }] },
        { OR: [{ endDate: null }, { endDate: { gte: lessonDate } }] },
      ],
    };
    const [assignment, normalAssignment] = await Promise.all([
      this.prisma.teacherAssignment.findFirst({
        where: {
          teacherId: teacher.id,
          ...assignmentDateWindow,
          OR: [
            { classSubjectId: classSubject.id },
            {
              classSubjectId: null,
              academicYearClassId: null,
              subjectId: dto.subjectId,
              OR: [{ academicYearId: null }, { academicYearId: academicYear.id }],
            },
          ],
        },
      }),
      this.prisma.teacherAssignment.findFirst({
        where: { classSubjectId: classSubject.id, ...assignmentDateWindow },
      }),
    ]);
    const isOverride = !assignment;
    const overrideReason = dto.overrideReason?.trim();
    if (isOverride && (!overrideReason || overrideReason.length < 5)) {
      throw new BadRequestException(
        "You are not normally assigned to this class and subject. Provide a short reason to continue.",
      );
    }

    const studentIds = dto.records.map((r) => r.studentId);
    const enrolledStudents = await this.prisma.studentEnrollment.findMany({
      where: {
        academicYearId: academicYear.id,
        classId: dto.classId,
        status: "ACTIVE",
        student: { id: { in: studentIds }, isActive: true },
      },
      select: { studentId: true },
    });
    if (new Set(enrolledStudents.map((item) => item.studentId)).size !== new Set(studentIds).size)
      throw new BadRequestException(
        "One or more students are not actively enrolled in this class for the selected academic year.",
      );

    const session = await this.prisma.attendanceSession.create({
      data: {
        teacherId: teacher.id,
        classId: dto.classId,
        subjectId: dto.subjectId,
        date: dto.date ? new Date(dto.date) : new Date(),
        academicYearId: academicYear.id,
        termId: term.id,
        academicYearClassId: classOffering.id,
        classSubjectId: classSubject.id,
        teacherAssignmentId: assignment?.id,
        normallyAssignedTeacherId: normalAssignment?.teacherId,
        lessonDate,
        lessonTime: lessonLocal.slice(11, 19),
        isAssignmentOverride: isOverride,
        overrideReason: isOverride ? overrideReason : undefined,
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
    if (isOverride) {
      await this.notifications.notifyDirectors({
        type: "ATTENDANCE_ASSIGNMENT_OVERRIDE",
        title: "Teacher covered an unassigned lesson",
        message: teacher.firstName + " " + teacher.lastName + " taught an unassigned class/subject. Reason: " + overrideReason,
        entityType: "AttendanceSession",
        entityId: session.id,
        link: `/director/attendance?sessionId=${session.id}`,
      });
    }
    return session;
  }

  async findAll() {
    return this.prisma.attendanceSession.findMany({
      orderBy: { date: "desc" },
      include: {
        teacher: { select: { id: true, firstName: true, lastName: true } },
        normallyAssignedTeacher: { select: { id: true, firstName: true, lastName: true } },
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
        normallyAssignedTeacher: { select: { id: true, firstName: true, lastName: true } },
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

  async getStudentsForClass(classId: string, academicYearId?: string) {
    const yearId = academicYearId ?? (await this.prisma.academicYear.findFirst({
      where: { status: "ACTIVE" },
      select: { id: true },
    }))?.id;
    if (!yearId) throw new BadRequestException("No active academic year is configured.");
    const enrollments = await this.prisma.studentEnrollment.findMany({
      where: {
        academicYearId: yearId,
        classId,
        status: "ACTIVE",
        student: { isActive: true },
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            admissionNumber: true,
            passportPhoto: true,
          },
        },
      },
      orderBy: { student: { firstName: "asc" } },
    });
    return enrollments.map((item) => item.student);
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
