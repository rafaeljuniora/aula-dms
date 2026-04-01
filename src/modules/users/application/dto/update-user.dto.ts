import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateUserDto {
  @ApiProperty({ example: "novo.usuario@escola.edu.br", required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, example: "novaSenha123" })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiProperty({ isArray: true, type: String, required: false })
  @IsArray()
  @IsOptional()
  permissions?: string[];
}
