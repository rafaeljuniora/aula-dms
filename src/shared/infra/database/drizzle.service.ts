import { studentsSchema } from "@academic/students/infra/schemas/student.schema";
import { subjectsSchema } from "@academic/subjects/infra/schemas/subject.schema";
import { teachersSchema } from "@academic/teachers/infra/schemas/teacher.schema";
import {
  attendanceStatusEnum,
  attendancesSchema,
} from "@attendance/infra/schemas/attendance.schema";
import {
  classOfferingStatusEnum,
  classOfferingsSchema,
} from "@class-offering/infra/schemas/class-offering.schema";
import {
  enrollmentStatusEnum,
  enrollmentsSchema,
} from "@enrollment/infra/schemas/enrollment.schema";
import { Injectable, type OnModuleDestroy } from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const schema = {
  subjectsSchema,
  studentsSchema,
  teachersSchema,
  classOfferingsSchema,
  classOfferingStatusEnum,
  enrollmentsSchema,
  enrollmentStatusEnum,
  attendancesSchema,
  attendanceStatusEnum,
};

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  private readonly pool: Pool;
  public readonly db;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.db = drizzle(this.pool, { schema });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
