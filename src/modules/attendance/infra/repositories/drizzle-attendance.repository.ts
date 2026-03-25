import {
  Attendance,
  AttendanceStatus,
} from "@attendance/domain/models/attendance.entity";
import type { AttendanceRepository } from "@attendance/domain/repositories/attendance-repository.interface";
import { attendancesSchema } from "@attendance/infra/schemas/attendance.schema";
import { Injectable } from "@nestjs/common";
import { DrizzleService } from "@shared/infra/database/drizzle.service";
import { and, eq } from "drizzle-orm";

@Injectable()
export class DrizzleAttendanceRepository implements AttendanceRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(attendance: Attendance): Promise<void> {
    await this.drizzleService.db.insert(attendancesSchema).values({
      studentId: attendance.studentId,
      lessonId: attendance.lessonId,
      status: attendance.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // class-offering-specific repository methods removed
}
