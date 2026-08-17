-- Brings the production schema in line with the existing Prisma fee-structure model.
-- All changes are additive and preserve existing structures and payments.
ALTER TABLE "FinanceStructure" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "FinanceStructure" ADD COLUMN "createdByUserId" TEXT;
ALTER TABLE "FinanceStructure" ADD COLUMN "updatedByUserId" TEXT;

ALTER TABLE "FinanceStructure"
  ADD CONSTRAINT "FinanceStructure_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "FinanceStructure"
  ADD CONSTRAINT "FinanceStructure_updatedByUserId_fkey"
  FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
