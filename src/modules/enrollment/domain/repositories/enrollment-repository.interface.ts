import type { Enrollment } from "@enrollment/domain/models/enrollment.entity";

export const ENROLLMENT_REPOSITORY = Symbol("ENROLLMENT_REPOSITORY");

export interface EnrollmentRepository {
  create(enrollment: Enrollment): Promise<void>;
  cancel(id: string): Promise<void>;
  findById(id: string): Promise<Enrollment | null>;

}
