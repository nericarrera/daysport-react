import { IsEmail, IsNotEmpty, IsOptional, MinLength, IsDateString } from 'class-validator';

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
  @IsDateString()
  birthDate?: string; // Usamos string para que se pueda enviar desde JSON y parsear después
}