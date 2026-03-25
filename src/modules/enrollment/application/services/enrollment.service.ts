import { EnrollmentDto } from "@enrollment/application/dto/enrollment.dto";
import {
  Enrollment,
  EnrollmentStatus,
} from "@enrollment/domain/models/enrollment.entity";
import {
  ENROLLMENT_REPOSITORY,
  type EnrollmentRepository,
} from "@enrollment/domain/repositories/enrollment-repository.interface";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

@Injectable()
export class EnrollmentService {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: EnrollmentRepository,
  ) {}

  async enroll(dto: { studentId: string }): Promise<void> {
    const enrollment = Enrollment.restore({
      studentId: dto.studentId,
      status: EnrollmentStatus.ACTIVE,
      enrolledAt: new Date(),
    });

    await this.enrollmentRepository.create(enrollment!);
  }

  async cancel(id: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findById(id);

    if (!enrollment) {
      throw new NotFoundException("Enrollment not found");
    }

    await this.enrollmentRepository.cancel(id);
  }


}
