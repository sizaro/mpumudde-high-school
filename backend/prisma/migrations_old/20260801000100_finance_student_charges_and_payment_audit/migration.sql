-- Adds an auditable, per-fee student billing layer without altering existing payments.
CREATE TABLE "StudentCharge" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "financeStructureId" TEXT NOT NULL,
    "expectedAmount" INTEGER NOT NULL,
    "paidAmount" INTEGER NOT NULL DEFAULT 0,
    "waivedAmount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'NOT_PAID',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "StudentCharge_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "StudentCharge_studentId_financeStructureId_key" ON "StudentCharge"("studentId", "financeStructureId");
CREATE INDEX "StudentCharge_studentId_status_idx" ON "StudentCharge"("studentId", "status");

ALTER TABLE "StudentCharge" ADD CONSTRAINT "StudentCharge_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StudentCharge" ADD CONSTRAINT "StudentCharge_financeStructureId_fkey" FOREIGN KEY ("financeStructureId") REFERENCES "FinanceStructure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Payment" ADD COLUMN "studentChargeId" TEXT;
ALTER TABLE "Payment" ADD COLUMN "receiptNumber" TEXT;
ALTER TABLE "Payment" ADD COLUMN "transactionReference" TEXT;
ALTER TABLE "Payment" ADD COLUMN "proofUrl" TEXT;
ALTER TABLE "Payment" ADD COLUMN "proofFileName" TEXT;
ALTER TABLE "Payment" ADD COLUMN "reversalReason" TEXT;
ALTER TABLE "Payment" ADD COLUMN "reversedAt" TIMESTAMP(3);
ALTER TABLE "Payment" ADD COLUMN "recordedByUserId" TEXT;
ALTER TABLE "Payment" ADD COLUMN "reversedByUserId" TEXT;

CREATE UNIQUE INDEX "Payment_receiptNumber_key" ON "Payment"("receiptNumber");
CREATE INDEX "Payment_studentId_date_idx" ON "Payment"("studentId", "date");
CREATE INDEX "Payment_studentChargeId_idx" ON "Payment"("studentChargeId");

ALTER TABLE "Payment" ADD CONSTRAINT "Payment_studentChargeId_fkey" FOREIGN KEY ("studentChargeId") REFERENCES "StudentCharge"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_recordedByUserId_fkey" FOREIGN KEY ("recordedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_reversedByUserId_fkey" FOREIGN KEY ("reversedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "PaymentAudit" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "changes" JSONB,
    "reason" TEXT,
    "actorUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentAudit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PaymentAudit_paymentId_createdAt_idx" ON "PaymentAudit"("paymentId", "createdAt");
ALTER TABLE "PaymentAudit" ADD CONSTRAINT "PaymentAudit_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PaymentAudit" ADD CONSTRAINT "PaymentAudit_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
