CREATE TABLE "AcademicYearClass" (
  "id" TEXT NOT NULL,
  "academicYearId" TEXT NOT NULL,
  "classId" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AcademicYearClass_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StudentEnrollment" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "academicYearId" TEXT NOT NULL,
  "termId" TEXT NOT NULL,
  "classId" TEXT NOT NULL,
  "studentCategoryId" TEXT,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "isCurrent" BOOLEAN NOT NULL DEFAULT true,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endedAt" TIMESTAMP(3),
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StudentEnrollment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AcademicYearClass_academicYearId_classId_key"
ON "AcademicYearClass"("academicYearId", "classId");
CREATE INDEX "AcademicYearClass_academicYearId_isActive_idx"
ON "AcademicYearClass"("academicYearId", "isActive");
CREATE INDEX "StudentEnrollment_studentId_isCurrent_idx"
ON "StudentEnrollment"("studentId", "isCurrent");
CREATE INDEX "StudentEnrollment_academicYearId_classId_idx"
ON "StudentEnrollment"("academicYearId", "classId");
CREATE UNIQUE INDEX "StudentEnrollment_one_current_per_student_key"
ON "StudentEnrollment"("studentId") WHERE "isCurrent" = true;

ALTER TABLE "AcademicYearClass" ADD CONSTRAINT "AcademicYearClass_academicYearId_fkey"
FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AcademicYearClass" ADD CONSTRAINT "AcademicYearClass_classId_fkey"
FOREIGN KEY ("classId") REFERENCES "SchoolClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StudentEnrollment" ADD CONSTRAINT "StudentEnrollment_studentId_fkey"
FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StudentEnrollment" ADD CONSTRAINT "StudentEnrollment_academicYearId_fkey"
FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StudentEnrollment" ADD CONSTRAINT "StudentEnrollment_termId_fkey"
FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StudentEnrollment" ADD CONSTRAINT "StudentEnrollment_classId_fkey"
FOREIGN KEY ("classId") REFERENCES "SchoolClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StudentEnrollment" ADD CONSTRAINT "StudentEnrollment_studentCategoryId_fkey"
FOREIGN KEY ("studentCategoryId") REFERENCES "StudentCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Preserve today's class availability before introducing year-specific control.
INSERT INTO "AcademicYearClass" ("id", "academicYearId", "classId", "isActive", "createdAt", "updatedAt")
SELECT md5(random()::text || ay."id" || sc."id"), ay."id", sc."id", true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "AcademicYear" ay
CROSS JOIN "SchoolClass" sc
WHERE ay."isActive" = true AND sc."isActive" = true
ON CONFLICT ("academicYearId", "classId") DO NOTHING;

-- Convert each student's present placement into the first immutable history row.
INSERT INTO "StudentEnrollment" (
  "id", "studentId", "academicYearId", "termId", "classId", "studentCategoryId",
  "status", "isCurrent", "startedAt", "endedAt", "createdAt", "updatedAt"
)
SELECT
  md5(random()::text || s."id"), s."id", s."academicYearId", s."termId", s."classId",
  s."studentCategoryId", CASE WHEN s."isActive" THEN 'ACTIVE' ELSE 'INACTIVE' END,
  s."isActive", s."createdAt", CASE WHEN s."isActive" THEN NULL ELSE CURRENT_TIMESTAMP END,
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Student" s
WHERE s."academicYearId" IS NOT NULL AND s."termId" IS NOT NULL AND s."classId" IS NOT NULL;
