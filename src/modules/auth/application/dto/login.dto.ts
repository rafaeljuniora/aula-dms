import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "admin@escola.edu.br" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "admin123" })
  @IsString()
  @IsNotEmpty()
  password: string;
}
