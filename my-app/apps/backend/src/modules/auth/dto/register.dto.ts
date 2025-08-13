
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsOptional()
  name?: string;

  // Opcionales para perfil completo
  @IsOptional()
  phone?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  postalCode?: string;

  @IsOptional()
  birthDate?: Date;
}