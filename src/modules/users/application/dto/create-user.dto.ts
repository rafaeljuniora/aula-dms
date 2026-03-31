import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "novo.usuario@escola.edu.br" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "senha123" })
  @IsString()
  password: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiProperty({ isArray: true, type: String })
  @IsArray()
  permissions: string[];
}
