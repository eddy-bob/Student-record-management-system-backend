import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../type';

export class AddOperatorDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEnum(Role)
  role: Role;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  adminPassword: string;
}
