-- Safe production migration: Kampala business dates/times and role support.
-- Run once with a database backup available:
-- psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f salon_production_safe_migration.sql
-- No historical columns or records are deleted.

BEGIN;

ALTER TABLE salon_sessions
  ADD COLUMN IF NOT EXISTS open_date DATE,
  ADD COLUMN IF NOT EXISTS close_date DATE;

UPDATE salon_sessions
SET open_date = (open_time AT TIME ZONE 'Africa/Kampala')::DATE
WHERE open_date IS NULL AND open_time IS NOT NULL;

UPDATE salon_sessions
SET close_date = (close_time AT TIME ZONE 'Africa/Kampala')::DATE
WHERE close_date IS NULL AND close_time IS NOT NULL;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salon_sessions' AND column_name = 'open_time' AND data_type = 'timestamp with time zone') THEN
    ALTER TABLE salon_sessions ALTER COLUMN open_time DROP DEFAULT;
    ALTER TABLE salon_sessions ALTER COLUMN open_time TYPE TIME WITHOUT TIME ZONE USING (open_time AT TIME ZONE 'Africa/Kampala')::TIME;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salon_sessions' AND column_name = 'close_time' AND data_type = 'timestamp with time zone') THEN
    ALTER TABLE salon_sessions ALTER COLUMN close_time TYPE TIME WITHOUT TIME ZONE USING (close_time AT TIME ZONE 'Africa/Kampala')::TIME;
  END IF;
  IF EXISTS (SELECT 1 FROM salon_sessions WHERE open_date IS NULL) THEN
    RAISE EXCEPTION 'Migration stopped: salon_sessions contains rows that cannot be assigned an open_date.';
  END IF;
END $$;

ALTER TABLE salon_sessions ALTER COLUMN open_date SET NOT NULL;

ALTER TABLE service_transactions
  ADD COLUMN IF NOT EXISTS service_date DATE,
  ADD COLUMN IF NOT EXISTS service_time TIME WITHOUT TIME ZONE,
  ADD COLUMN IF NOT EXISTS entry_type VARCHAR(20);

UPDATE service_transactions
SET service_date = (service_timestamp AT TIME ZONE 'Africa/Kampala')::DATE,
    service_time = (service_timestamp AT TIME ZONE 'Africa/Kampala')::TIME
WHERE service_timestamp IS NOT NULL AND (service_date IS NULL OR service_time IS NULL);

UPDATE service_transactions SET entry_type = 'current' WHERE entry_type IS NULL;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM service_transactions WHERE service_date IS NULL OR service_time IS NULL) THEN
    RAISE EXCEPTION 'Migration stopped: service_transactions contains rows that cannot be assigned service date/time.';
  END IF;
END $$;

ALTER TABLE service_transactions
  ALTER COLUMN entry_type SET DEFAULT 'current',
  ALTER COLUMN service_date SET NOT NULL,
  ALTER COLUMN service_time SET NOT NULL,
  ALTER COLUMN entry_type SET NOT NULL;
ALTER TABLE service_transactions DROP CONSTRAINT IF EXISTS service_transactions_entry_type_check;
ALTER TABLE service_transactions ADD CONSTRAINT service_transactions_entry_type_check CHECK (entry_type IN ('current', 'past'));

ALTER TABLE advances
  ADD COLUMN IF NOT EXISTS advance_date DATE,
  ADD COLUMN IF NOT EXISTS advance_time TIME WITHOUT TIME ZONE;

UPDATE advances
SET advance_date = (created_at AT TIME ZONE 'Africa/Kampala')::DATE,
    advance_time = (created_at AT TIME ZONE 'Africa/Kampala')::TIME
WHERE advance_date IS NULL OR advance_time IS NULL;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM advances WHERE advance_date IS NULL OR advance_time IS NULL) THEN
    RAISE EXCEPTION 'Migration stopped: advances contains rows that cannot be assigned date/time.';
  END IF;
END $$;

ALTER TABLE advances ALTER COLUMN advance_date SET NOT NULL, ALTER COLUMN advance_time SET NOT NULL;

ALTER TABLE employee_clocking
  ADD COLUMN IF NOT EXISTS clock_in_date DATE,
  ADD COLUMN IF NOT EXISTS clock_in_time TIME WITHOUT TIME ZONE,
  ADD COLUMN IF NOT EXISTS clock_out_date DATE,
  ADD COLUMN IF NOT EXISTS clock_out_time TIME WITHOUT TIME ZONE;

UPDATE employee_clocking
SET clock_in_date = (clock_in AT TIME ZONE 'Africa/Kampala')::DATE,
    clock_in_time = (clock_in AT TIME ZONE 'Africa/Kampala')::TIME
WHERE clock_in IS NOT NULL AND (clock_in_date IS NULL OR clock_in_time IS NULL);

UPDATE employee_clocking
SET clock_out_date = (clock_out AT TIME ZONE 'Africa/Kampala')::DATE,
    clock_out_time = (clock_out AT TIME ZONE 'Africa/Kampala')::TIME
WHERE clock_out IS NOT NULL AND (clock_out_date IS NULL OR clock_out_time IS NULL);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM employee_clocking WHERE clock_in_date IS NULL OR clock_in_time IS NULL) THEN
    RAISE EXCEPTION 'Migration stopped: employee_clocking contains rows that cannot be assigned clock-in date/time.';
  END IF;
  IF EXISTS (SELECT 1 FROM employee_clocking ec LEFT JOIN users u ON u.id = ec.employee_id WHERE ec.employee_id IS NOT NULL AND u.id IS NULL) THEN
    RAISE EXCEPTION 'Migration stopped: employee_clocking contains employee_id values not found in users.';
  END IF;
  ALTER TABLE employee_clocking DROP CONSTRAINT IF EXISTS fk_employee_clocking_employee_name;
  ALTER TABLE employee_clocking ALTER COLUMN employee_id DROP NOT NULL;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'employee_clocking'::regclass AND conname = 'fk_employee_clocking_employee') THEN
    ALTER TABLE employee_clocking ADD CONSTRAINT fk_employee_clocking_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

ALTER TABLE employee_clocking ALTER COLUMN clock_in_date SET NOT NULL, ALTER COLUMN clock_in_time SET NOT NULL;

ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM users WHERE role IS NOT NULL AND role NOT IN ('owner', 'manager', 'employee', 'cashier', 'customer')) THEN
    RAISE EXCEPTION 'Migration stopped: users contains a role outside the approved role list.';
  END IF;
END $$;

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('owner', 'manager', 'employee', 'cashier', 'customer'));

COMMIT;

-- These run after COMMIT so PostgreSQL can build them without a long write lock.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_service_transactions_salon_date_time ON service_transactions (salon_id, service_date, service_time);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_advances_salon_date_time ON advances (salon_id, advance_date, advance_time);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_employee_clocking_salon_in_date_time ON employee_clocking (salon_id, clock_in_date, clock_in_time);

-- Read-only post-migration verification.
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('salon_sessions', 'service_transactions', 'advances', 'employee_clocking', 'users')
  AND column_name IN ('open_date', 'close_date', 'open_time', 'close_time', 'service_date', 'service_time', 'entry_type', 'advance_date', 'advance_time', 'clock_in_date', 'clock_in_time', 'clock_out_date', 'clock_out_time', 'gender')
ORDER BY table_name, ordinal_position;
