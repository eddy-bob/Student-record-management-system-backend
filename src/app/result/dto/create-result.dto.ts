import { IsNotEmpty, IsString } from 'class-validator';
export class CreateResultDto {
  @IsString()
  @IsNotEmpty()
  score: string;
  @IsString()
  @IsNotEmpty()
  student: string;
  @IsString()
  @IsNotEmpty()
  course: string;
  @IsString()
  @IsNotEmpty()
  session: string;
}
