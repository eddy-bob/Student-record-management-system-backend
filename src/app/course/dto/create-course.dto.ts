import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Level, Options, Semester } from 'src/types/course';
export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  courseCode: string;

  @IsEnum(Options)
  @IsNotEmpty()
  option: Options;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsEnum(Level)
  @IsNotEmpty()
  level: Level;

  @IsEnum(Semester)
  @IsNotEmpty()
  semester: Semester;
}
