CREATE TABLE "StudentNumberSequence" (
  "year" INTEGER NOT NULL,
  "nextNumber" INTEGER NOT NULL DEFAULT 1,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StudentNumberSequence_pkey" PRIMARY KEY ("year")
);
