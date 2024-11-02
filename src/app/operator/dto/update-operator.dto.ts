import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateOperatorDto } from './create-operator.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOperatorDto extends PartialType(
  OmitType(CreateOperatorDto, ['role', 'adminPassword']),
) {
  @IsOptional()
  @IsString()
  newPassword: string;
}

export class UpdateOperatorAsSuperDto extends PartialType(
  OmitType(CreateOperatorDto, ['adminPassword']),
) {}
