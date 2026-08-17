ALTER TABLE "Parent"
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "archivedAt" TIMESTAMP(3),
ADD COLUMN "archivedByUserId" TEXT;

ALTER TABLE "StudentParent"
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "unlinkedAt" TIMESTAMP(3),
ADD COLUMN "unlinkedByUserId" TEXT,
ADD COLUMN "unlinkReason" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "Parent_isActive_idx" ON "Parent"("isActive");
CREATE INDEX "StudentParent_parentId_isActive_idx" ON "StudentParent"("parentId", "isActive");
CREATE INDEX "StudentParent_studentId_isActive_idx" ON "StudentParent"("studentId", "isActive");
