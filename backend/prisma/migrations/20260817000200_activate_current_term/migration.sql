-- Preserve a usable default academic context after introducing term statuses.
-- Prefer the term whose configured dates contain today, then the latest term
-- that has already started, and finally Term 1 when dates are not configured.
WITH active_year AS (
  SELECT id FROM "AcademicYear" WHERE status = 'ACTIVE' LIMIT 1
), ranked AS (
  SELECT term.id,
    ROW_NUMBER() OVER (
      ORDER BY
        CASE WHEN CURRENT_DATE BETWEEN term."startDate"::date AND term."endDate"::date THEN 0 ELSE 1 END,
        CASE WHEN term."startDate"::date <= CURRENT_DATE THEN 0 ELSE 1 END,
        term."startDate" DESC NULLS LAST,
        term.name ASC
    ) AS position
  FROM "Term" term
  JOIN active_year year ON year.id = term."academicYearId"
)
UPDATE "Term" term
SET status = CASE WHEN ranked.position = 1 THEN 'ACTIVE' ELSE 'UPCOMING' END,
    "isActive" = ranked.position = 1
FROM ranked
WHERE term.id = ranked.id;
