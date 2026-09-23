-- Change payments.course_id from uuid to text so it can store course codes
-- (the course catalog uses string codes like "ENG101", not UUIDs).
-- This is safe because course_id is nullable and has no foreign key constraint.

ALTER TABLE payments ALTER COLUMN course_id TYPE text;

-- Drop and recreate the unique index since the column type changed
DROP INDEX IF EXISTS uniq_active_payment;
CREATE UNIQUE INDEX uniq_active_payment
  ON payments(student_id, course_id, provider)
  WHERE status IN ('pending', 'paid');

-- Drop and recreate indexes that reference course_id
DROP INDEX IF EXISTS idx_payments_course;
CREATE INDEX idx_payments_course ON payments(course_id);
