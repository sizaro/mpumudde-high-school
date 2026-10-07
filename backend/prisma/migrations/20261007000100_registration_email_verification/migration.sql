-- Email ownership must be proven before a new guardian or teacher profile is
-- created. This record is intentionally separate from portal-login identity.
CREATE TABLE "RegistrationEmailVerification" (
    "id" TEXT NOT NULL,
    "ownerType" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "normalizedEmail" TEXT NOT NULL,
    "verificationCodeHash" TEXT,
    "verificationExpiresAt" TIMESTAMP(3),
    "verificationAttempts" INTEGER NOT NULL DEFAULT 0,
    "verificationRequestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verificationDeliveryStatus" TEXT,
    "verificationDeliveryError" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistrationEmailVerification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RegistrationEmailVerification_ownerType_normalizedEmail_verifiedAt_idx"
ON "RegistrationEmailVerification"("ownerType", "normalizedEmail", "verifiedAt");

CREATE INDEX "RegistrationEmailVerification_verificationExpiresAt_idx"
ON "RegistrationEmailVerification"("verificationExpiresAt");
