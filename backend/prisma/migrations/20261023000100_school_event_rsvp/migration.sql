-- Add optional RSVP settings to shared school events. Existing events keep RSVP disabled.
ALTER TABLE "SchoolEvent"
  ADD COLUMN "rsvpEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "rsvpMode" TEXT NOT NULL DEFAULT 'ALUMNI_ONLY',
  ADD COLUMN "rsvpDeadline" TIMESTAMP(3),
  ADD COLUMN "rsvpCapacity" INTEGER,
  ADD COLUMN "waitlistEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "whatsappGroupUrl" TEXT,
  ADD COLUMN "organiserEmail" TEXT;

CREATE TABLE "SchoolEventRsvp" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "alumniId" TEXT,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "normalizedEmail" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING_CONFIRMATION',
  "guestCount" INTEGER NOT NULL DEFAULT 0,
  "note" TEXT,
  "requestedAttendance" TEXT NOT NULL DEFAULT 'GOING',
  "confirmationTokenHash" TEXT,
  "confirmationExpiresAt" TIMESTAMP(3),
  "confirmationSentAt" TIMESTAMP(3),
  "confirmedAt" TIMESTAMP(3),
  "manageTokenHash" TEXT,
  "manageTokenExpiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SchoolEventRsvp_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SchoolEventRsvp_eventId_normalizedEmail_key" ON "SchoolEventRsvp"("eventId", "normalizedEmail");
CREATE INDEX "SchoolEventRsvp_eventId_status_idx" ON "SchoolEventRsvp"("eventId", "status");
CREATE INDEX "SchoolEventRsvp_alumniId_idx" ON "SchoolEventRsvp"("alumniId");
CREATE INDEX "SchoolEventRsvp_confirmationExpiresAt_idx" ON "SchoolEventRsvp"("confirmationExpiresAt");
ALTER TABLE "SchoolEventRsvp" ADD CONSTRAINT "SchoolEventRsvp_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "SchoolEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SchoolEventRsvp" ADD CONSTRAINT "SchoolEventRsvp_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "Alumni"("id") ON DELETE SET NULL ON UPDATE CASCADE;