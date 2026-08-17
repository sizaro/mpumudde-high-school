-- Backward-compatible academic history, official assignments, flexible attendance,
-- notifications, and immutable student-charge context.

ALTER TABLE "AcademicYear"
  ADD COLUMN "startDate" DATE,
  ADD COLUMN "endDate" DATE,
  ADD COLUMN "status" VARCHAR(20) NOT NULL DEFAULT 'UPCOMING';

WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (
    ORDER BY
      CASE WHEN "isActive" THEN 0 ELSE 1 END,
      name DESC,
      "createdAt" DESC
  ) AS position
  FROM "AcademicYear"
)
UPDATE "AcademicYear" year
SET
  status = CASE WHEN ranked.position = 1 THEN 'ACTIVE' ELSE 'COMPLETED' END,
  "isActive" = ranked.position = 1
FROM ranked
WHERE year.id = ranked.id;

CREATE UNIQUE INDEX "AcademicYear_single_active_status"
  ON "AcademicYear" (status)
  WHERE status = 'ACTIVE';

ALTER TABLE "Term"
  ADD COLUMN "status" VARCHAR(20) NOT NULL DEFAULT 'UPCOMING';

UPDATE "Term" term
SET status = CASE
  WHEN year.status = 'COMPLETED' THEN 'COMPLETED'
  ELSE 'UPCOMING'
END,
"isActive" = FALSE
FROM "AcademicYear" year
WHERE year.id = term."academicYearId";

CREATE UNIQUE INDEX "Term_single_active_status"
  ON "Term" (status)
  WHERE status = 'ACTIVE';

CREATE TABLE "ClassSubject" (
  id TEXT NOT NULL,
  "academicYearClassId" TEXT NOT NULL,
  "subjectId" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ClassSubject_pkey" PRIMARY KEY (id),
  CONSTRAINT "ClassSubject_academicYearClassId_fkey"
    FOREIGN KEY ("academicYearClassId") REFERENCES "AcademicYearClass"(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ClassSubject_subjectId_fkey"
    FOREIGN KEY ("subjectId") REFERENCES "Subject"(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "ClassSubject_academicYearClassId_subjectId_key"
  ON "ClassSubject" ("academicYearClassId", "subjectId");
CREATE INDEX "ClassSubject_academicYearClassId_isActive_idx"
  ON "ClassSubject" ("academicYearClassId", "isActive");

ALTER TABLE "TeacherAssignment"
  DROP CONSTRAINT IF EXISTS "TeacherAssignment_teacherId_subjectId_key",
  ADD COLUMN "academicYearId" TEXT,
  ADD COLUMN "academicYearClassId" TEXT,
  ADD COLUMN "classSubjectId" TEXT,
  ADD COLUMN "startDate" DATE,
  ADD COLUMN "endDate" DATE,
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  ADD CONSTRAINT "TeacherAssignment_academicYearId_fkey"
    FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "TeacherAssignment_academicYearClassId_fkey"
    FOREIGN KEY ("academicYearClassId") REFERENCES "AcademicYearClass"(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "TeacherAssignment_classSubjectId_fkey"
    FOREIGN KEY ("classSubjectId") REFERENCES "ClassSubject"(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "TeacherAssignment_teacherId_academicYearId_isActive_idx"
  ON "TeacherAssignment" ("teacherId", "academicYearId", "isActive");
CREATE INDEX "TeacherAssignment_classSubjectId_isActive_idx"
  ON "TeacherAssignment" ("classSubjectId", "isActive");

ALTER TABLE "StudentEnrollment"
  ALTER COLUMN "termId" DROP NOT NULL,
  ADD COLUMN "academicYearClassId" TEXT,
  ADD CONSTRAINT "StudentEnrollment_academicYearClassId_fkey"
    FOREIGN KEY ("academicYearClassId") REFERENCES "AcademicYearClass"(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

UPDATE "StudentEnrollment" enrollment
SET "academicYearClassId" = offering.id
FROM "AcademicYearClass" offering
WHERE offering."academicYearId" = enrollment."academicYearId"
  AND offering."classId" = enrollment."classId"
  AND enrollment."academicYearClassId" IS NULL;

WITH duplicates AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY "studentId"
    ORDER BY "startedAt" DESC, "createdAt" DESC
  ) AS position
  FROM "StudentEnrollment"
  WHERE "isCurrent" = TRUE
)
UPDATE "StudentEnrollment" enrollment
SET
  "isCurrent" = FALSE,
  status = CASE WHEN status = 'ACTIVE' THEN 'COMPLETED' ELSE status END,
  "endedAt" = COALESCE("endedAt", CURRENT_TIMESTAMP)
FROM duplicates
WHERE enrollment.id = duplicates.id
  AND duplicates.position > 1;

CREATE INDEX "StudentEnrollment_academicYearClassId_status_idx"
  ON "StudentEnrollment" ("academicYearClassId", status);
CREATE UNIQUE INDEX "StudentEnrollment_one_current_per_student"
  ON "StudentEnrollment" ("studentId")
  WHERE "isCurrent" = TRUE;

ALTER TABLE "FinanceStructure"
  ADD COLUMN "academicYearClassId" TEXT,
  ADD CONSTRAINT "FinanceStructure_academicYearClassId_fkey"
    FOREIGN KEY ("academicYearClassId") REFERENCES "AcademicYearClass"(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

UPDATE "FinanceStructure" structure
SET "academicYearClassId" = offering.id
FROM "AcademicYearClass" offering
WHERE offering."academicYearId" = structure."academicYearId"
  AND offering."classId" = structure."classId"
  AND structure."academicYearClassId" IS NULL;

ALTER TABLE "StudentCharge"
  ADD COLUMN "academicYearId" TEXT,
  ADD COLUMN "termId" TEXT,
  ADD COLUMN "classId" TEXT,
  ADD COLUMN "studentCategoryId" TEXT,
  ADD COLUMN "feeTypeId" TEXT;

UPDATE "StudentCharge" charge
SET
  "academicYearId" = structure."academicYearId",
  "termId" = structure."termId",
  "classId" = structure."classId",
  "studentCategoryId" = structure."studentCategoryId",
  "feeTypeId" = structure."feeTypeId"
FROM "FinanceStructure" structure
WHERE structure.id = charge."financeStructureId";

ALTER TABLE "AttendanceSession"
  ADD COLUMN "academicYearId" TEXT,
  ADD COLUMN "termId" TEXT,
  ADD COLUMN "academicYearClassId" TEXT,
  ADD COLUMN "classSubjectId" TEXT,
  ADD COLUMN "teacherAssignmentId" TEXT,
  ADD COLUMN "normallyAssignedTeacherId" TEXT,
  ADD COLUMN "lessonDate" DATE,
  ADD COLUMN "lessonTime" VARCHAR(8),
  ADD COLUMN "isAssignmentOverride" BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN "overrideReason" TEXT,
  ADD CONSTRAINT "AttendanceSession_academicYearId_fkey"
    FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "AttendanceSession_termId_fkey"
    FOREIGN KEY ("termId") REFERENCES "Term"(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "AttendanceSession_academicYearClassId_fkey"
    FOREIGN KEY ("academicYearClassId") REFERENCES "AcademicYearClass"(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "AttendanceSession_classSubjectId_fkey"
    FOREIGN KEY ("classSubjectId") REFERENCES "ClassSubject"(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "AttendanceSession_teacherAssignmentId_fkey"
    FOREIGN KEY ("teacherAssignmentId") REFERENCES "TeacherAssignment"(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "AttendanceSession_normallyAssignedTeacherId_fkey"
    FOREIGN KEY ("normallyAssignedTeacherId") REFERENCES "Teacher"(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

UPDATE "AttendanceSession"
SET
  "lessonDate" = (date AT TIME ZONE 'Africa/Kampala')::DATE,
  "lessonTime" = TO_CHAR(date AT TIME ZONE 'Africa/Kampala', 'HH24:MI:SS')
WHERE "lessonDate" IS NULL;

CREATE INDEX "AttendanceSession_academicYearId_termId_classId_idx"
  ON "AttendanceSession" ("academicYearId", "termId", "classId");
CREATE INDEX "AttendanceSession_teacherId_lessonDate_idx"
  ON "AttendanceSession" ("teacherId", "lessonDate");

CREATE TABLE "Notification" (
  id TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  "entityType" TEXT,
  "entityId" TEXT,
  link TEXT,
  "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "readAt" TIMESTAMP(3),
  CONSTRAINT "Notification_pkey" PRIMARY KEY (id),
  CONSTRAINT "Notification_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Notification_userId_isRead_createdAt_idx"
  ON "Notification" ("userId", "isRead", "createdAt");
