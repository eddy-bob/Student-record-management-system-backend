import { Repository } from 'typeorm';

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { getRepository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Injectable()
export class ObjectValidationPipe implements PipeTransform<any> {
  repository: Repository<any>;

  constructor(
    private readonly entity: EntityClassOrSchema,
    private readonly field: string,
  ) {
    this.repository = getRepository(this.entity);
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    if (metatype == Array) {
      for (let data of value as Array<any>) {
        const isInstanceOfEntity = await this.repository.findOneBy({
          id: data[this.field],
        });
        if (!isInstanceOfEntity)
          throw new BadRequestException(
            `Validation  for field ${this.field} failed`,
          );
      }
    } else {
      const isInstanceOfEntity = await this.repository.findOneBy({
        id: value[this.field],
      });
      if (!isInstanceOfEntity)
        throw new BadRequestException(
          `Validation  for field ${this.field} failed`,
        );
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
