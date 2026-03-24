import type { User } from "@users/domain/models/user.entity";

export class UserDto {
  private constructor(
    public id: string,
    public email: string,
    public teacherId: string | undefined,
    public permissions: string[],
  ) {}

  public static from(user: User | null): UserDto | null {
    if (!user) return null;

    return new UserDto(user.id!, user.email, user.teacherId, user.permissions);
  }
}
