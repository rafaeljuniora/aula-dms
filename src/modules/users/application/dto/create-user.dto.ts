import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "novo.usuario@escola.edu.br" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "senha123" })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiProperty({ isArray: true, type: String })
  @IsArray()
  @IsNotEmpty()
  permissions: string[];
}
