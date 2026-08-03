-- Payment business dates are stored as Kampala-local calendar strings.
-- Existing Prisma timestamps contain UTC clock values, so preserve their
-- intended Uganda time by converting UTC -> Africa/Kampala before casting.
ALTER TABLE "Payment" ALTER COLUMN "date" DROP DEFAULT;

ALTER TABLE "Payment"
ALTER COLUMN "date" TYPE VARCHAR(19)
USING to_char(
  ("date" AT TIME ZONE 'UTC') AT TIME ZONE 'Africa/Kampala',
  'YYYY-MM-DD"T"HH24:MI:SS'
);
