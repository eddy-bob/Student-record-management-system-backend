import { OmitType } from '@nestjs/mapped-types';
import { CreateOperatorDto } from './create-operator.dto';

export class UpdateOperatorDto extends OmitType(CreateOperatorDto, ['role']) {}
export class UpdateOperatorAsSuperDto extends CreateOperatorDto {}
