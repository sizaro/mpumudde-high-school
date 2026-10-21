-- Additive foundation for school publications and shared school events.
-- No existing Alumni, SchoolCommunication, or communication-recipient rows are
-- modified by this migration.

CREATE TABLE "SchoolPublication" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'ALUMNI_STORY',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "category" TEXT,
    "contentDocument" JSONB,
    "alumniId" TEXT,
    "authorUserId" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "featuredImageUrl" TEXT,
    "featuredImagePublicId" TEXT,
    "featuredImageAlt" TEXT,
    "consentConfirmedAt" TIMESTAMP(3),
    "consentConfirmedByUserId" TEXT,
    "consentNote" TEXT,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SchoolPublication_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SchoolPublicationImage" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT,
    "altText" TEXT NOT NULL,
    "caption" TEXT,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "bytes" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SchoolPublicationImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SchoolEventSeries" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "recurrenceRule" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SchoolEventSeries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SchoolEvent" (
    "id" TEXT NOT NULL,
    "seriesId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descriptionDocument" JSONB,
    "type" TEXT NOT NULL,
    "venue" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "recurrenceRule" TEXT NOT NULL DEFAULT 'ONE_TIME',
    "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "publicationStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "operationalStatus" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "featuredImageUrl" TEXT,
    "featuredImagePublicId" TEXT,
    "featuredImageAlt" TEXT,
    "announcementCommunicationId" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "updatedByUserId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SchoolEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SchoolEventAudience" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "schoolClassId" TEXT,
    "academicYearId" TEXT,
    "stream" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SchoolEventAudience_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SchoolEventChange" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT,
    "previousValues" JSONB,
    "nextValues" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SchoolEventChange_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SchoolEventImage" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT,
    "altText" TEXT NOT NULL,
    "caption" TEXT,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "bytes" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SchoolEventImage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SchoolPublication_slug_key" ON "SchoolPublication"("slug");
CREATE INDEX "SchoolPublication_kind_status_publishedAt_idx" ON "SchoolPublication"("kind", "status", "publishedAt");
CREATE INDEX "SchoolPublication_alumniId_idx" ON "SchoolPublication"("alumniId");
CREATE INDEX "SchoolPublication_isFeatured_publishedAt_idx" ON "SchoolPublication"("isFeatured", "publishedAt");
CREATE UNIQUE INDEX "SchoolPublicationImage_publicationId_sortOrder_key" ON "SchoolPublicationImage"("publicationId", "sortOrder");
CREATE INDEX "SchoolPublicationImage_cloudinaryPublicId_idx" ON "SchoolPublicationImage"("cloudinaryPublicId");
CREATE INDEX "SchoolEventSeries_recurrenceRule_idx" ON "SchoolEventSeries"("recurrenceRule");
CREATE UNIQUE INDEX "SchoolEvent_slug_key" ON "SchoolEvent"("slug");
CREATE UNIQUE INDEX "SchoolEvent_announcementCommunicationId_key" ON "SchoolEvent"("announcementCommunicationId");
CREATE INDEX "SchoolEvent_publicationStatus_visibility_startsAt_idx" ON "SchoolEvent"("publicationStatus", "visibility", "startsAt");
CREATE INDEX "SchoolEvent_operationalStatus_startsAt_idx" ON "SchoolEvent"("operationalStatus", "startsAt");
CREATE INDEX "SchoolEvent_seriesId_startsAt_idx" ON "SchoolEvent"("seriesId", "startsAt");
CREATE INDEX "SchoolEventAudience_audience_eventId_idx" ON "SchoolEventAudience"("audience", "eventId");
CREATE INDEX "SchoolEventAudience_schoolClassId_idx" ON "SchoolEventAudience"("schoolClassId");
CREATE INDEX "SchoolEventAudience_academicYearId_idx" ON "SchoolEventAudience"("academicYearId");
CREATE INDEX "SchoolEventChange_eventId_createdAt_idx" ON "SchoolEventChange"("eventId", "createdAt");
CREATE INDEX "SchoolEventChange_actorUserId_createdAt_idx" ON "SchoolEventChange"("actorUserId", "createdAt");
CREATE UNIQUE INDEX "SchoolEventImage_eventId_sortOrder_key" ON "SchoolEventImage"("eventId", "sortOrder");
CREATE INDEX "SchoolEventImage_cloudinaryPublicId_idx" ON "SchoolEventImage"("cloudinaryPublicId");

ALTER TABLE "SchoolPublication" ADD CONSTRAINT "SchoolPublication_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "Alumni"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SchoolPublication" ADD CONSTRAINT "SchoolPublication_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SchoolPublication" ADD CONSTRAINT "SchoolPublication_consentConfirmedByUserId_fkey" FOREIGN KEY ("consentConfirmedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SchoolPublicationImage" ADD CONSTRAINT "SchoolPublicationImage_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "SchoolPublication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SchoolEventSeries" ADD CONSTRAINT "SchoolEventSeries_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SchoolEvent" ADD CONSTRAINT "SchoolEvent_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "SchoolEventSeries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SchoolEvent" ADD CONSTRAINT "SchoolEvent_announcementCommunicationId_fkey" FOREIGN KEY ("announcementCommunicationId") REFERENCES "SchoolCommunication"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SchoolEvent" ADD CONSTRAINT "SchoolEvent_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SchoolEvent" ADD CONSTRAINT "SchoolEvent_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SchoolEventAudience" ADD CONSTRAINT "SchoolEventAudience_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "SchoolEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SchoolEventAudience" ADD CONSTRAINT "SchoolEventAudience_schoolClassId_fkey" FOREIGN KEY ("schoolClassId") REFERENCES "SchoolClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SchoolEventAudience" ADD CONSTRAINT "SchoolEventAudience_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SchoolEventChange" ADD CONSTRAINT "SchoolEventChange_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "SchoolEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SchoolEventChange" ADD CONSTRAINT "SchoolEventChange_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SchoolEventImage" ADD CONSTRAINT "SchoolEventImage_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "SchoolEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
