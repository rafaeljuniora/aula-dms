import { AttendanceService } from "@attendance/application/services/attendance.service";
import { AttendanceStatus } from "@attendance/domain/models/attendance.entity";
import { Permission } from "@shared/domain/enums/permission.enum";
import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";
import { Body, Controller, Post } from "@nestjs/common";

@Controller("attendances")
export class AttendancesController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // REMOVED: endpoints that referenced class-offering (module removed)

  @Post()
  @RequirePermissions(Permission.ATTENDANCES_WRITE)
  async register(
    @Body() body: { studentId: string; lessonId: string; status: AttendanceStatus },
  ) {
    return this.attendanceService.register(body);
  }
}
