-- Communication contacts are intentionally separate from portal login identity.
-- Existing Parent.email and Teacher.email are copied as UNVERIFIED contacts;
-- registration remains valid even when no address can be verified immediately.

CREATE TABLE "CommunicationContact" (
    "id" TEXT NOT NULL,
    "ownerType" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'EMAIL',
    "value" TEXT NOT NULL,
    "normalizedValue" TEXT NOT NULL,
    "label" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verificationCodeHash" TEXT,
    "verificationExpiresAt" TIMESTAMP(3),
    "verificationAttempts" INTEGER NOT NULL DEFAULT 0,
    "verificationRequestedAt" TIMESTAMP(3),
    "verificationDeliveryStatus" TEXT,
    "verificationDeliveryError" TEXT,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunicationContact_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CommunicationContact_ownerType_ownerId_kind_normalizedValue_key"
ON "CommunicationContact"("ownerType", "ownerId", "kind", "normalizedValue");

CREATE INDEX "CommunicationContact_ownerType_ownerId_isActive_idx"
ON "CommunicationContact"("ownerType", "ownerId", "isActive");

CREATE INDEX "CommunicationContact_kind_normalizedValue_isVerified_idx"
ON "CommunicationContact"("kind", "normalizedValue", "isVerified");

CREATE TABLE "SchoolCommunication" (
    "id" TEXT NOT NULL,
    "senderUserId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "targeting" JSONB,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolCommunication_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CommunicationRecipient" (
    "id" TEXT NOT NULL,
    "communicationId" TEXT NOT NULL,
    "recipientType" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "portalUserId" TEXT,
    "communicationContactId" TEXT,
    "emailAddress" TEXT,
    "portalNotificationId" TEXT,
    "portalStatus" TEXT NOT NULL DEFAULT 'NOT_APPLICABLE',
    "emailStatus" TEXT NOT NULL DEFAULT 'NOT_APPLICABLE',
    "emailError" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunicationRecipient_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CommunicationRecipient_portalNotificationId_key"
ON "CommunicationRecipient"("portalNotificationId");
CREATE UNIQUE INDEX "CommunicationRecipient_communicationId_recipientType_recipientId_key"
ON "CommunicationRecipient"("communicationId", "recipientType", "recipientId");
CREATE INDEX "SchoolCommunication_audience_sentAt_idx" ON "SchoolCommunication"("audience", "sentAt");
CREATE INDEX "SchoolCommunication_senderUserId_createdAt_idx" ON "SchoolCommunication"("senderUserId", "createdAt");
CREATE INDEX "CommunicationRecipient_recipientType_recipientId_idx" ON "CommunicationRecipient"("recipientType", "recipientId");
CREATE INDEX "CommunicationRecipient_communicationId_emailStatus_idx" ON "CommunicationRecipient"("communicationId", "emailStatus");

ALTER TABLE "SchoolCommunication"
ADD CONSTRAINT "SchoolCommunication_senderUserId_fkey"
FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CommunicationRecipient"
ADD CONSTRAINT "CommunicationRecipient_communicationId_fkey"
FOREIGN KEY ("communicationId") REFERENCES "SchoolCommunication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CommunicationRecipient"
ADD CONSTRAINT "CommunicationRecipient_communicationContactId_fkey"
FOREIGN KEY ("communicationContactId") REFERENCES "CommunicationContact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CommunicationRecipient"
ADD CONSTRAINT "CommunicationRecipient_portalNotificationId_fkey"
FOREIGN KEY ("portalNotificationId") REFERENCES "Notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "CommunicationContact" (
    "id", "ownerType", "ownerId", "kind", "value", "normalizedValue",
    "isPrimary", "isActive", "isVerified", "createdAt", "updatedAt"
)
SELECT
    'contact_parent_' || md5(parent.id || lower(btrim(parent.email))),
    'PARENT', parent.id, 'EMAIL', btrim(parent.email), lower(btrim(parent.email)),
    true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Parent" parent
WHERE parent.email IS NOT NULL AND btrim(parent.email) <> ''
ON CONFLICT ("ownerType", "ownerId", "kind", "normalizedValue") DO NOTHING;

INSERT INTO "CommunicationContact" (
    "id", "ownerType", "ownerId", "kind", "value", "normalizedValue",
    "isPrimary", "isActive", "isVerified", "createdAt", "updatedAt"
)
SELECT
    'contact_teacher_' || md5(teacher.id || lower(btrim(teacher.email))),
    'TEACHER', teacher.id, 'EMAIL', btrim(teacher.email), lower(btrim(teacher.email)),
    true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Teacher" teacher
WHERE teacher.email IS NOT NULL AND btrim(teacher.email) <> ''
ON CONFLICT ("ownerType", "ownerId", "kind", "normalizedValue") DO NOTHING;
