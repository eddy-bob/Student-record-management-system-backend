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
    const { confirmPassword, ...remaining } = data;

    if (confirmPassword) {
      const user = await this.operatorRepository
        .createQueryBuilder('operator')
        .where('operator.id = :id', { id: self.id })
        .addSelect('operator.password')
        .getOne();

      const isMatch = await user.matchPassword(confirmPassword);

      if (!isMatch) {
        throw new ForbiddenException('Incorrect password');
      }
      user.password = confirmPassword;
      await this.operatorRepository.save(user);
    }
    await this.operatorRepository.update(self.id, remaining);
    return new SuccessResponse({}, `Profile updated successfully`);
  }
  //TODO CREATE OPERATOR
  public async create(payload: CreateOperatorDto, user: Operator) {
    const { adminPassword, ...data } = payload;
    const admin = await this.operatorRepository
      .createQueryBuilder('operator')
      .where('operator.id = :id', { id: user.id })
      .addSelect('operator.password')
      .getOne();

    const isMatch = await user.matchPassword(adminPassword);

    if (!isMatch) {
      throw new ForbiddenException('Incorrect password');
    }

    const operator = this.operatorRepository.create(data);
    return await this.operatorRepository.save(operator);
  }
}
