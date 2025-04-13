import { IsNotEmpty } from 'class-validator';

export class AddResultDto {
  @IsNotEmpty()
  score: string;

  @IsNotEmpty()
  student: string;

  @IsNotEmpty()
  course: string;

  @IsNotEmpty()
  session: string;
}
