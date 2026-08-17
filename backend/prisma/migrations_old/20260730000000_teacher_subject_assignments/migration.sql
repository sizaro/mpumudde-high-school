-- A teaching assignment grants a teacher a subject across the school, rather
-- than restricting that subject to one class. Consolidate duplicate subjects
-- before applying the new uniqueness rule.
DELETE FROM "TeacherAssignment" AS duplicate
USING "TeacherAssignment" AS retained
WHERE duplicate.ctid > retained.ctid
  AND duplicate."teacherId" = retained."teacherId"
  AND duplicate."subjectId" = retained."subjectId";

ALTER TABLE "TeacherAssignment"
  DROP CONSTRAINT IF EXISTS "TeacherAssignment_teacherId_classId_subjectId_key";
DROP INDEX IF EXISTS "TeacherAssignment_teacherId_classId_subjectId_key";
ALTER TABLE "TeacherAssignment"
  DROP CONSTRAINT IF EXISTS "TeacherAssignment_classId_fkey";
ALTER TABLE "TeacherAssignment"
  DROP COLUMN "classId";
CREATE UNIQUE INDEX "TeacherAssignment_teacherId_subjectId_key"
  ON "TeacherAssignment"("teacherId", "subjectId");
