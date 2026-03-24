export class CreateUserDto {
  email: string;
  password: string;
  teacherId?: string;
  permissions: string[];
}
