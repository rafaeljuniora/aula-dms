import { AuthModule } from "@auth/auth.module";
import { AttendanceModule } from "@attendance/attendance.module";
import { EnrollmentModule } from "@enrollment/enrollment.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SharedModule } from "@shared/shared.module";
import { UsersModule } from "@users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule,
    UsersModule,
    AuthModule,
    EnrollmentModule,
    AttendanceModule,
  ],
})
export class AppModule {}
