export class UpdateUserDto {
  email: string;
  password?: string;
  teacherId?: string;
  permissions: string[];
}
