-- Keep the existing school usable immediately: under the previous model every
-- active subject was available to every active class, and a teacher's subject
-- assignment applied across classes. New academic years can be curated in UI.
INSERT INTO "ClassSubject" (id, "academicYearClassId", "subjectId", "isActive", "createdAt", "updatedAt")
SELECT
  'cs_' || md5(offering.id || subject.id || clock_timestamp()::text || random()::text),
  offering.id,
  subject.id,
  TRUE,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "AcademicYearClass" offering
JOIN "AcademicYear" year ON year.id = offering."academicYearId" AND year.status = 'ACTIVE'
CROSS JOIN "Subject" subject
WHERE offering."isActive" = TRUE
  AND subject."isActive" = TRUE
ON CONFLICT ("academicYearClassId", "subjectId") DO UPDATE SET "isActive" = TRUE;

INSERT INTO "TeacherAssignment" (
  id,
  "teacherId",
  "subjectId",
  "academicYearId",
  "academicYearClassId",
  "classSubjectId",
  "isActive",
  "createdAt"
)
SELECT
  'ta_' || md5(legacy.id || class_subject.id || clock_timestamp()::text || random()::text),
  legacy."teacherId",
  legacy."subjectId",
  offering."academicYearId",
  offering.id,
  class_subject.id,
  TRUE,
  CURRENT_TIMESTAMP
FROM "TeacherAssignment" legacy
JOIN "ClassSubject" class_subject ON class_subject."subjectId" = legacy."subjectId" AND class_subject."isActive" = TRUE
JOIN "AcademicYearClass" offering ON offering.id = class_subject."academicYearClassId" AND offering."isActive" = TRUE
JOIN "AcademicYear" year ON year.id = offering."academicYearId" AND year.status = 'ACTIVE'
WHERE legacy."academicYearId" IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM "TeacherAssignment" current_assignment
    WHERE current_assignment."teacherId" = legacy."teacherId"
      AND current_assignment."classSubjectId" = class_subject.id
      AND current_assignment."isActive" = TRUE
  );
