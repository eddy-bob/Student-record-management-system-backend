import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Operator } from './entities/operator.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { SuccessResponse } from 'src/utils/response';
import { CreateOperatorDto } from './dto/create-operator.dto';
import {
  UpdateOperatorAsSuperDto,
  UpdateOperatorDto,
} from './dto/update-operator.dto';
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
  public async updateOne(id: string, data: UpdateOperatorAsSuperDto) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('Operator does not exist');
    await this.operatorRepository.update(user.id, data);
    return new SuccessResponse(
      {},
      `Operator with id ${id} updated successfully`,
    );
  }
  public async updateSelf(self: Operator, data: UpdateOperatorDto) {
    await this.operatorRepository.update(self.id, data);
    return new SuccessResponse({}, `Profile updated successfully`);
  }
  //TODO CREATE OPERATOR
  public async create(payload: CreateOperatorDto, user: Operator) {
    const { adminPassword, ...data } = payload;
    const operatorData = await this.findOne(user.id);

    const matchPassword = operatorData.matchPassword(adminPassword);
    if (!matchPassword) {
      throw new ForbiddenException('Passord does not match admin password');
    }

    const operator = this.operatorRepository.create(data);
    return await this.operatorRepository.save(operator);
  }
}
