import { IsEnum, IsNotEmpty } from 'class-validator';
import { Options, Level, Semester } from '../../type';

export class AddCourseDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  courseCode: string;

  @IsEnum(Options)
  option: Options;

  @IsNotEmpty()
  unit: string;

  @IsEnum(Level)
  level: Level;

  @IsEnum(Semester)
  semester: Semester;
}
