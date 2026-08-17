-- Adds a real source for non-student school income used by finance summaries.
CREATE TABLE "OtherIncome" (
  "id" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "source" TEXT NOT NULL,
  "method" TEXT NOT NULL,
  "incomeDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "description" TEXT,
  "referenceNumber" TEXT,
  "proofUrl" TEXT,
  "proofFileName" TEXT,
  "status" TEXT NOT NULL DEFAULT 'RECEIVED',
  "recordedByUserId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OtherIncome_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "OtherIncome_incomeDate_status_idx" ON "OtherIncome"("incomeDate", "status");
CREATE INDEX "OtherIncome_recordedByUserId_idx" ON "OtherIncome"("recordedByUserId");
ALTER TABLE "OtherIncome" ADD CONSTRAINT "OtherIncome_recordedByUserId_fkey" FOREIGN KEY ("recordedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
