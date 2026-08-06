import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { toKampalaLocalDateTime } from "../common/utils/kampala-date-time.js";
import { CreateStudentDto } from "./dto/create-student.dto.js";
import { LinkParentDto } from "./dto/link-parent.dto.js";
import { UpdateStudentDto } from "./dto/update-student.dto.js";
import { CompleteStudentRegistrationDto } from "./dto/complete-student-registration.dto.js";
import * as bcrypt from "bcrypt";

function generateGuardianTempPassword(length = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

function guardianLoginEmailBase(firstName: string, lastName: string): string {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  return `${normalize(firstName)}.${normalize(lastName)}`;
}

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    return this.prisma.$transaction(async (tx) => {
      const created = await tx.student.create({
        data: {
          admissionNumber: await this.generateStudentNumber(tx),
          firstName: createStudentDto.firstName,
          lastName: createStudentDto.lastName,
          dateOfBirth: createStudentDto.dateOfBirth
            ? new Date(createStudentDto.dateOfBirth)
            : undefined,
          gender: createStudentDto.gender,
          passportPhoto: createStudentDto.passportPhoto,
          isActive: createStudentDto.isActive ?? true,
          academicYearId: createStudentDto.academicYearId,
          termId: createStudentDto.termId,
          classId: createStudentDto.classId,
          studentCategoryId: createStudentDto.studentCategoryId,
        },
      });

      for (const parentInput of createStudentDto.parents ?? []) {
        let parentId = parentInput.parentId;

        if (parentId) {
          const existing = await tx.parent.findUnique({
            where: { id: parentId },
          });
          if (!existing)
            throw new BadRequestException(
              "The selected parent does not exist.",
            );
        } else {
          const parent = await tx.parent.create({
            data: {
              firstName: parentInput.firstName,
              lastName: parentInput.lastName,
              gender: parentInput.gender,
              phone: parentInput.phone,
              email: parentInput.email,
              address: parentInput.address,
              occupation: parentInput.occupation,
              profilePhoto: parentInput.profilePhoto,
              relationship: parentInput.relationship,
            },
          });
          parentId = parent.id;
        }

        await tx.studentParent.create({
          data: {
            studentId: created.id,
            parentId,
            relationship: parentInput.relationship,
            isPrimary: parentInput.isPrimary ?? false,
          },
        });
      }

      return tx.student.findUniqueOrThrow({
        where: { id: created.id },
        include: {
          parents: { include: { parent: true } },
          academicYear: true,
          term: true,
          schoolClass: true,
          studentCategory: true,
        },
      });
    });
  }

  async createCompleteRegistration(dto: CompleteStudentRegistrationDto) {
    const {
      student,
      primaryGuardian,
      additionalGuardians = [],
      payments = [],
    } = dto;
    const parentRole = primaryGuardian?.fullName
      ? await this.prisma.role.findUnique({ where: { name: "PARENT" } })
      : null;
    if (primaryGuardian?.fullName && !parentRole) {
      throw new BadRequestException("PARENT role is not configured.");
    }
    const guardianTemporaryPassword = primaryGuardian?.fullName
      ? generateGuardianTempPassword()
      : undefined;
    const guardianPasswordHash = guardianTemporaryPassword
      ? await bcrypt.hash(guardianTemporaryPassword, 12)
      : undefined;
    const feeTypes = await this.prisma.feeType.findMany({
      where: { isActive: true },
    });
    const normalizedPayments = payments.map((payment) => ({
      ...payment,
      feeTypeId:
        feeTypes.find(
          (feeType) =>
            feeType.name.toLowerCase() === payment.feeTypeName?.toLowerCase(),
        )?.id ?? payment.feeTypeId,
    }));
    const registrationFee = feeTypes.find(
      (feeType) => feeType.name.toLowerCase() === "registration",
    );
    if (!registrationFee)
      throw new BadRequestException(
        "Create the Registration fee type in Academic Setup before registering a student.",
      );
    if (
      !normalizedPayments.some(
        (payment) =>
          payment.feeTypeId === registrationFee.id && payment.amount > 0,
      )
    )
      throw new BadRequestException(
        "Select Registration and enter its payment amount before continuing.",
      );
    return this.prisma.$transaction(
      async (tx) => {
        const admissionNumber = await this.generateStudentNumber(tx);
        const created = await tx.student.create({
          data: {
            admissionNumber,
            firstName: student.firstName,
            lastName: student.lastName,
            dateOfBirth: student.dateOfBirth
              ? new Date(student.dateOfBirth)
              : undefined,
            gender: student.gender,
            passportPhoto: student.passportPhoto,
            nationality: student.nationality,
            address: student.address,
            previousSchool: student.previousSchool,
            bloodGroup: student.bloodGroup,
            allergies: student.allergies,
            medicalConditions: student.medicalConditions,
            specialNeeds: student.specialNeeds,
            medicalNotes: student.medicalNotes,
            isActive: student.isActive ?? true,
            academicYearId: student.academicYearId,
            termId: student.termId,
            classId: student.classId,
            studentCategoryId: student.studentCategoryId,
          },
        });

        const matchingStructures = await tx.financeStructure.findMany({
          where: {
            academicYearId: student.academicYearId,
            termId: student.termId,
            classId: student.classId,
            studentCategoryId: student.studentCategoryId,
            isActive: true,
          },
        });
        if (matchingStructures.length) {
          await tx.studentCharge.createMany({
            data: matchingStructures.map((structure) => ({
              studentId: created.id,
              financeStructureId: structure.id,
              expectedAmount: structure.expectedAmount,
            })),
            skipDuplicates: true,
          });
        }

        const guardians = [
          ...(primaryGuardian?.fullName
            ? [{ ...primaryGuardian, primary: true }]
            : []),
          ...additionalGuardians
            .filter((guardian) => guardian.name.trim() || guardian.parentId)
            .map((guardian) => ({
              fullName: guardian.name,
              phone: guardian.phone,
              email: guardian.email,
              parentId: guardian.parentId,
              relationship: "Additional Guardian",
              primary: false,
            })),
        ];
        let guardianCredentials:
          { email: string; temporaryPassword: string } | undefined;
        for (const guardian of guardians) {
          const names = guardian.fullName.trim().split(/\s+/);
          const communicationEmail =
            "email" in guardian
              ? guardian.email?.trim() || undefined
              : undefined;
          const phone = guardian.phone?.trim() || undefined;
          const explicitParent =
            "parentId" in guardian && guardian.parentId
              ? await tx.parent.findFirst({
                  where: { id: guardian.parentId, isActive: true },
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    email: true,
                    relationship: true,
                    occupation: true,
                    address: true,
                    profilePhoto: true,
                    identityDocumentType: true,
                    identityDocumentUrl: true,
                    userId: true,
                  },
                })
              : null;
          if ("parentId" in guardian && guardian.parentId && !explicitParent) {
            throw new BadRequestException(
              "The selected guardian could not be found. Refresh the page and try again.",
            );
          }
          const possibleParents =
            !explicitParent && (communicationEmail || phone)
              ? await tx.parent.findMany({
                  where: {
                    isActive: true,
                    OR: [
                      ...(communicationEmail
                        ? [
                            {
                              email: {
                                equals: communicationEmail,
                                mode: "insensitive" as const,
                              },
                            },
                          ]
                        : []),
                      ...(phone ? [{ phone }] : []),
                    ],
                  },
                  orderBy: { createdAt: "asc" },
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    email: true,
                    relationship: true,
                    occupation: true,
                    address: true,
                    profilePhoto: true,
                    identityDocumentType: true,
                    identityDocumentUrl: true,
                    userId: true,
                  },
                })
              : [];
          const existingParent =
            explicitParent ??
            this.selectExistingGuardianMatch(possibleParents, {
              firstName: names[0] || "",
              lastName: names.slice(1).join(" "),
              phone,
              email: communicationEmail,
            });

          const parent = existingParent
            ? await tx.parent.update({
                where: { id: existingParent.id },
                data: {
                  phone: phone ?? existingParent.phone,
                  email: communicationEmail ?? existingParent.email,
                  relationship:
                    guardian.relationship ?? existingParent.relationship,
                  occupation:
                    "occupation" in guardian
                      ? guardian.occupation || existingParent.occupation
                      : existingParent.occupation,
                  address:
                    "address" in guardian
                      ? guardian.address || existingParent.address
                      : existingParent.address,
                  profilePhoto:
                    "profilePhoto" in guardian
                      ? guardian.profilePhoto || existingParent.profilePhoto
                      : existingParent.profilePhoto,
                  identityDocumentType:
                    "identityDocumentType" in guardian
                      ? guardian.identityDocumentType ||
                        existingParent.identityDocumentType
                      : existingParent.identityDocumentType,
                  identityDocumentUrl:
                    "identityDocumentUrl" in guardian
                      ? guardian.identityDocumentUrl ||
                        existingParent.identityDocumentUrl
                      : existingParent.identityDocumentUrl,
                },
              })
            : await tx.parent.create({
                data: {
                  firstName: names[0] || "Guardian",
                  lastName: names.slice(1).join(" ") || "Guardian",
                  phone,
                  relationship: guardian.relationship,
                  email: communicationEmail,
                  occupation:
                    "occupation" in guardian ? guardian.occupation : undefined,
                  address: "address" in guardian ? guardian.address : undefined,
                  profilePhoto:
                    "profilePhoto" in guardian
                      ? guardian.profilePhoto
                      : undefined,
                  identityDocumentType:
                    "identityDocumentType" in guardian
                      ? guardian.identityDocumentType
                      : undefined,
                  identityDocumentUrl:
                    "identityDocumentUrl" in guardian
                      ? guardian.identityDocumentUrl
                      : undefined,
                },
              });

          if (
            guardian.primary &&
            !parent.userId &&
            guardianPasswordHash &&
            guardianTemporaryPassword
          ) {
            const loginEmail = await this.generateGuardianLoginEmail(
              tx,
              parent.firstName,
              parent.lastName,
              admissionNumber,
            );
            await tx.user.create({
              data: {
                email: loginEmail,
                password: guardianPasswordHash,
                parent: { connect: { id: parent.id } },
                roles: { create: { roleId: parentRole!.id } },
              },
            });
            guardianCredentials = {
              email: loginEmail,
              temporaryPassword: guardianTemporaryPassword,
            };
          }

          await tx.studentParent.upsert({
            where: {
              studentId_parentId: {
                studentId: created.id,
                parentId: parent.id,
              },
            },
            create: {
              studentId: created.id,
              parentId: parent.id,
              relationship: guardian.relationship,
              isPrimary: guardian.primary,
            },
            update: {
              relationship: guardian.relationship,
              isPrimary: guardian.primary,
            },
          });
        }
        for (const payment of normalizedPayments) {
          const structure = matchingStructures.find(
            (item) =>
              item.feeTypeId === payment.feeTypeId &&
              item.academicYearId === payment.academicYearId &&
              item.termId === payment.termId,
          );
          const charge = structure
            ? await tx.studentCharge.findUnique({
                where: {
                  studentId_financeStructureId: {
                    studentId: created.id,
                    financeStructureId: structure.id,
                  },
                },
              })
            : null;
          await tx.payment.create({
            data: {
              studentId: created.id,
              feeTypeId: payment.feeTypeId,
              financeStructureId: structure?.id,
              studentChargeId: charge?.id,
              amount: payment.amount,
              method: payment.method,
              receiptUrl: payment.receiptUrl,
              status: "COMPLETED",
              date: toKampalaLocalDateTime(),
            },
          });
          if (charge) {
            const paidAmount = charge.paidAmount + payment.amount;
            const balance =
              charge.expectedAmount - paidAmount - charge.waivedAmount;
            const status =
              balance < 0
                ? "OVERPAID"
                : balance === 0
                  ? "FULLY_PAID"
                  : "PARTIALLY_PAID";
            await tx.studentCharge.update({
              where: { id: charge.id },
              data: { paidAmount, status },
            });
          }
        }
        const registeredStudent = await tx.student.findUniqueOrThrow({
          where: { id: created.id },
          include: {
            parents: {
              include: {
                parent: {
                  include: {
                    user: { select: { email: true, isActive: true } },
                  },
                },
              },
            },
            academicYear: true,
            term: true,
            schoolClass: true,
            studentCategory: true,
          },
        });
        return { student: registeredStudent, guardianCredentials };
      },
      { maxWait: 10_000, timeout: 20_000 },
    );
  }

  async findAll() {
    return this.prisma.student.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        parents: {
          where: { isActive: true, parent: { isActive: true } },
          include: { parent: true },
        },
        payments: true,
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        parents: {
          where: { isActive: true, parent: { isActive: true } },
          include: { parent: true },
        },
        payments: true,
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
      },
    });
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const data: Record<string, unknown> = {};

    if (updateStudentDto.admissionNumber !== undefined) {
      data.admissionNumber = updateStudentDto.admissionNumber;
    }
    if (updateStudentDto.firstName !== undefined) {
      data.firstName = updateStudentDto.firstName;
    }
    if (updateStudentDto.lastName !== undefined) {
      data.lastName = updateStudentDto.lastName;
    }
    if (updateStudentDto.dateOfBirth !== undefined) {
      data.dateOfBirth = updateStudentDto.dateOfBirth
        ? new Date(updateStudentDto.dateOfBirth)
        : null;
    }
    if (updateStudentDto.gender !== undefined) {
      data.gender = updateStudentDto.gender;
    }
    if (updateStudentDto.passportPhoto !== undefined) {
      data.passportPhoto = updateStudentDto.passportPhoto;
    }
    for (const field of [
      "nationality",
      "address",
      "previousSchool",
      "bloodGroup",
      "allergies",
      "medicalConditions",
      "specialNeeds",
      "medicalNotes",
    ] as const) {
      if (updateStudentDto[field] !== undefined)
        data[field] = updateStudentDto[field];
    }
    if (updateStudentDto.isActive !== undefined) {
      data.isActive = updateStudentDto.isActive;
    }
    if (updateStudentDto.academicYearId !== undefined) {
      data.academicYearId = updateStudentDto.academicYearId;
    }
    if (updateStudentDto.termId !== undefined) {
      data.termId = updateStudentDto.termId;
    }
    if (updateStudentDto.classId !== undefined) {
      data.classId = updateStudentDto.classId;
    }
    if (updateStudentDto.studentCategoryId !== undefined) {
      data.studentCategoryId = updateStudentDto.studentCategoryId;
    }

    return this.prisma.student.update({
      where: { id },
      data,
      include: {
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
      },
    });
  }

  async linkParent(studentId: string, linkParentDto: LinkParentDto) {
    const [student, parent] = await Promise.all([
      this.prisma.student.findUnique({
        where: { id: studentId },
        select: { id: true },
      }),
      this.prisma.parent.findUnique({
        where: { id: linkParentDto.parentId },
        select: { id: true },
      }),
    ]);

    if (!student) throw new BadRequestException("Student not found.");
    if (!parent) throw new BadRequestException("Parent not found.");

    return this.prisma.$transaction(async (tx) => {
      if (linkParentDto.isPrimary) {
        await tx.studentParent.updateMany({
          where: { studentId },
          data: { isPrimary: false },
        });
      }

      return tx.studentParent.upsert({
        where: {
          studentId_parentId: { studentId, parentId: linkParentDto.parentId },
        },
        create: {
          studentId,
          parentId: linkParentDto.parentId,
          relationship: linkParentDto.relationship,
          isPrimary: linkParentDto.isPrimary ?? false,
        },
        update: {
          relationship: linkParentDto.relationship,
          isPrimary: linkParentDto.isPrimary ?? false,
        },
        include: { parent: true, student: true },
      });
    });
  }

  async remove(id: string) {
    return this.prisma.student.update({
      where: { id },
      data: { isActive: false },
      include: {
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
      },
    });
  }

  async getFinanceSummary(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        academicYear: true,
        term: true,
        schoolClass: true,
        studentCategory: true,
        payments: {
          include: {
            financeStructure: {
              include: {
                feeType: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      return null;
    }

    const financeStructures = await this.prisma.financeStructure.findMany({
      where: {
        academicYearId: student.academicYearId ?? undefined,
        termId: student.termId ?? undefined,
        classId: student.classId ?? undefined,
        studentCategoryId: student.studentCategoryId ?? undefined,
      },
      include: {
        feeType: true,
      },
    });

    const summary = financeStructures.map((structure) => {
      const paid = student.payments
        .filter((payment) => payment.financeStructureId === structure.id)
        .reduce((sum, payment) => sum + payment.amount, 0);

      return {
        feeType: structure.feeType?.name ?? "Fee",
        expectedAmount: structure.expectedAmount,
        paidAmount: paid,
        balance: structure.expectedAmount - paid,
        financeStructureId: structure.id,
      };
    });

    return {
      student: {
        id: student.id,
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        passportPhoto: student.passportPhoto,
        academicYear: student.academicYear?.name,
        term: student.term?.name,
        className: student.schoolClass?.name,
        studentCategory: student.studentCategory?.name,
      },
      summary,
      totalExpected: summary.reduce(
        (sum, item) => sum + item.expectedAmount,
        0,
      ),
      totalPaid: summary.reduce((sum, item) => sum + item.paidAmount, 0),
      totalBalance: summary.reduce((sum, item) => sum + item.balance, 0),
    };
  }

  private async generateStudentNumber(tx: any) {
    const year = new Date().getFullYear();
    const counter = await tx.studentNumberSequence.upsert({
      where: { year },
      create: { year, nextNumber: 2 },
      update: { nextNumber: { increment: 1 } },
    });
    return `MHS-${year}-${String(counter.nextNumber - 1).padStart(4, "0")}`;
  }

  private async generateGuardianLoginEmail(
    tx: any,
    firstName: string,
    lastName: string,
    admissionNumber: string,
  ) {
    const base = guardianLoginEmailBase(firstName, lastName) || "guardian";
    let suffix = 0;

    while (true) {
      const email = `${base}${suffix || ""}@mhs.com`;
      const existing = await tx.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (!existing) return email;
      suffix += 1;
    }
  }

  private selectExistingGuardianMatch(
    parents: Array<{
      id: string;
      firstName: string;
      lastName: string;
      phone: string | null;
      email: string | null;
      relationship: string | null;
      occupation: string | null;
      address: string | null;
      profilePhoto: string | null;
      identityDocumentType: string | null;
      identityDocumentUrl: string | null;
      userId: string | null;
    }>,
    guardian: {
      firstName: string;
      lastName: string;
      phone?: string;
      email?: string;
    },
  ) {
    if (!parents.length) return null;
    if (parents.length === 1) {
      const [onlyParent] = parents;
      const firstNameMatches =
        onlyParent.firstName.trim().toLowerCase() ===
        guardian.firstName.trim().toLowerCase();
      const lastNameMatches =
        onlyParent.lastName.trim().toLowerCase() ===
        guardian.lastName.trim().toLowerCase();
      const phoneMatches = guardian.phone
        ? onlyParent.phone === guardian.phone
        : false;
      const emailMatches = guardian.email
        ? onlyParent.email?.trim().toLowerCase() ===
          guardian.email.trim().toLowerCase()
        : false;
      return firstNameMatches &&
        lastNameMatches &&
        (phoneMatches || emailMatches || (!guardian.phone && !guardian.email))
        ? onlyParent
        : null;
    }

    return (
      parents.find((parent) => {
        const firstNameMatches =
          parent.firstName.trim().toLowerCase() ===
          guardian.firstName.trim().toLowerCase();
        const lastNameMatches =
          parent.lastName.trim().toLowerCase() ===
          guardian.lastName.trim().toLowerCase();
        const phoneMatches = guardian.phone
          ? parent.phone === guardian.phone
          : false;
        const emailMatches = guardian.email
          ? parent.email?.trim().toLowerCase() ===
            guardian.email.trim().toLowerCase()
          : false;
        return (
          firstNameMatches && lastNameMatches && (phoneMatches || emailMatches)
        );
      }) ?? null
    );
  }
}
