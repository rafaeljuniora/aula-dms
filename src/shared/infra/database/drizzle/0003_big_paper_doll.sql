ALTER TABLE IF EXISTS "students" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE IF EXISTS "subjects" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE IF EXISTS "teachers" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE IF EXISTS "attendances" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE IF EXISTS "class_offerings" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE IF EXISTS "enrollments" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
DROP TABLE IF EXISTS "students" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "subjects" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "teachers" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "attendances" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "class_offerings" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "enrollments" CASCADE;
--> statement-breakpoint
ALTER TABLE IF EXISTS "users" DROP CONSTRAINT IF EXISTS "users_teacher_id_teachers_id_fk";
--> statement-breakpoint
DROP TYPE IF EXISTS "public"."attendance_status";
--> statement-breakpoint
DROP TYPE IF EXISTS "public"."class_offering_status";
--> statement-breakpoint
DROP TYPE IF EXISTS "public"."enrollment_status";