import { IsEnum, IsNotEmpty } from 'class-validator';
import { Gender, Options } from '../type';

export class AddStudentDto {
  @IsNotEmpty()
  regNumber: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  middleName?: string;

  @IsNotEmpty()
  admissionSet: string;

  option?: Options;

  @IsEnum(Gender)
  gender: Gender;
}
