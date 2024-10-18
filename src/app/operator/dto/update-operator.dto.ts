import { OmitType } from '@nestjs/mapped-types';
import { CreateOperatorDto } from './create-operator.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOperatorDto extends OmitType(CreateOperatorDto, [
  'role',
  'adminPassword',
]) {
  @IsOptional()
  @IsString()
  newPassword: string;
}
export class UpdateOperatorAsSuperDto extends OmitType(CreateOperatorDto, [
  'adminPassword',
]) {}
