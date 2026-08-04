-- Parent.email is contact information and may be shared by guardians.
-- Portal login uniqueness is enforced by User.email instead.
ALTER TABLE "Parent"
DROP CONSTRAINT IF EXISTS "Parent_email_key";
