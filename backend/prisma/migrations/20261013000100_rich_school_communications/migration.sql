-- Additive upgrade for rich official school communications. Existing plain-text
-- rows remain valid and render as legacy announcements.
ALTER TABLE "SchoolCommunication"
  ADD COLUMN "format" TEXT NOT NULL DEFAULT 'ANNOUNCEMENT',
  ADD COLUMN "contentDocument" JSONB,
  ADD COLUMN "templateVersion" TEXT DEFAULT 'mhs-email-v1';

CREATE INDEX "SchoolCommunication_status_updatedAt_idx"
  ON "SchoolCommunication"("status", "updatedAt");

CREATE TABLE "CommunicationTestEmail" (
  "id" TEXT NOT NULL,
  "senderUserId" TEXT NOT NULL,
  "recipientEmail" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "error" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CommunicationTestEmail_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CommunicationTestEmail_senderUserId_createdAt_idx"
  ON "CommunicationTestEmail"("senderUserId", "createdAt");
