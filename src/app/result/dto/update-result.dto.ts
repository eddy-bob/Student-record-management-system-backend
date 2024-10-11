import { OmitType } from '@nestjs/mapped-types';
import { CreateResultDto } from './create-result.dto';

export class UpdateResultDto extends OmitType(CreateResultDto, [
  'course',
  'student',
]) {}
