-- DropForeignKey
ALTER TABLE "StudentEnrollment" DROP CONSTRAINT "StudentEnrollment_termId_fkey";

-- DropIndex
DROP INDEX "TeacherAssignment_teacherId_subjectId_key";

-- AlterTable
ALTER TABLE "AcademicYear" ALTER COLUMN "status" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Term" ALTER COLUMN "status" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Alumni" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "graduationYear" INTEGER,
    "studentPeriod" TEXT,
    "whatsappNumber" TEXT,
    "profileImageUrl" TEXT,
    "profileImagePublicId" TEXT,
    "rememberedPerson" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lockedAt" TIMESTAMP(3),
    "lockedReason" TEXT,
    "possibleStudentMatch" BOOLEAN NOT NULL DEFAULT false,
    "possibleStudentMatchDetails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alumni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumniRegistrationSession" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlumniRegistrationSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alumni_email_key" ON "Alumni"("email");

-- CreateIndex
CREATE INDEX "Alumni_fullName_idx" ON "Alumni"("fullName");

-- CreateIndex
CREATE INDEX "Alumni_isActive_idx" ON "Alumni"("isActive");

-- CreateIndex
CREATE INDEX "Alumni_graduationYear_idx" ON "Alumni"("graduationYear");

-- CreateIndex
CREATE UNIQUE INDEX "AlumniRegistrationSession_tokenHash_key" ON "AlumniRegistrationSession"("tokenHash");

-- CreateIndex
CREATE INDEX "AlumniRegistrationSession_email_idx" ON "AlumniRegistrationSession"("email");

-- CreateIndex
CREATE INDEX "AlumniRegistrationSession_expiresAt_idx" ON "AlumniRegistrationSession"("expiresAt");

-- AddForeignKey
ALTER TABLE "StudentEnrollment" ADD CONSTRAINT "StudentEnrollment_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "CommunicationRecipient_communicationId_recipientType_recipientI" RENAME TO "CommunicationRecipient_communicationId_recipientType_recipi_key";
