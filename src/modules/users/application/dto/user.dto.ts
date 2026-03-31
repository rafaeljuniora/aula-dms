import type { User } from "@users/domain/models/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false, nullable: true })
  teacherId: string | undefined;

  @ApiProperty({ isArray: true, type: String })
  permissions: string[];

  private constructor(
    id: string,
    email: string,
    teacherId: string | undefined,
    permissions: string[],
  ) {
    this.id = id;
    this.email = email;
    this.teacherId = teacherId;
    this.permissions = permissions;
  }

  public static from(user: User | null): UserDto | null {
    if (!user) return null;

    return new UserDto(user.id!, user.email, user.teacherId, user.permissions);
  }
}
