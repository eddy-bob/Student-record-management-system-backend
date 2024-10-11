import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Operator } from './entities/operator.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { SuccessResponse } from 'src/utils/response';
import { CreateOperatorDto } from './dto/create-operator.dto';
@Injectable()
export class OperatorService {
  constructor(
    @InjectRepository(Operator)
    private readonly operatorRepository: Repository<Operator>,
  ) {}
  public async findOne(id: string) {
    return await this.operatorRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async find(options: FindOptionsWhere<Operator>) {
    return await this.operatorRepository.findBy(options);
  }
  public async deleteOne(id: string) {
    const user = await this.findOne(id);
    await this.operatorRepository.delete(user.id);
    return new SuccessResponse(
      {},
      `Operator with id ${id} deleted successfully`,
    );
  }
  //TODO CREATE OPERATOR
  public async create(payload: CreateOperatorDto) {
    const operator = this.operatorRepository.create(payload);
    return await this.operatorRepository.save(operator);
  }
}
