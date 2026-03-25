import { EnrollmentService } from "@enrollment/application/services/enrollment.service";
import { Permission } from "@shared/domain/enums/permission.enum";
import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";
import { Body, Controller, Delete, Param, Post } from "@nestjs/common";

@Controller("enrollments")
export class EnrollmentsController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @RequirePermissions(Permission.ENROLLMENTS_WRITE)
  async enroll(@Body() body: { studentId: string }) {
    return this.enrollmentService.enroll(body);
  }

  @Delete(":id")
  @RequirePermissions(Permission.ENROLLMENTS_DELETE)
  async cancel(@Param("id") id: string) {
    return this.enrollmentService.cancel(id);
  }
}
