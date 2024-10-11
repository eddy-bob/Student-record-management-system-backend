import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Options } from 'src/types/student';
export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  regNumber: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  middleName: string;

  @IsString()
  @IsNotEmpty()
  admissionSet: string;

  @IsEnum(Options)
  @IsOptional()
  option: Options;
}
