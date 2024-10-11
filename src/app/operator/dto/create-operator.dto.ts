import { IsEmail, IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { Role } from 'src/types/operator';

export class CreateOperatorDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsNotEmpty()
  password: string;
}
