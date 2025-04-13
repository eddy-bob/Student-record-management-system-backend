import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Operator } from './operator.entity';
import { AddOperatorDto } from './dto/add-operator.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { HashUtil } from '../common/utils/hash.util';

@Injectable()
export class OperatorService {
  constructor(
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
  ) {}

  async createOperator(
    data: AddOperatorDto,
    adminPassword: string,
  ): Promise<Operator> {
    const superAdmin = await this.operatorRepository.findOne({
      where: { email: process.env.ADMIN_EMAIL },
      select: ['id', 'password'],
    });

    if (
      !superAdmin ||
      !(await HashUtil.compare(adminPassword, superAdmin.password))
    ) {
      throw new UnauthorizedException('Invalid admin password');
    }

    const hashedPassword = await HashUtil.hash(data.password);
    const operator = this.operatorRepository.create({
      ...data,
      password: hashedPassword,
    });

    return this.operatorRepository.save(operator);
  }

  async updateOperator(
    id: string,
    data: Partial<AddOperatorDto>,
    adminPassword: string,
  ): Promise<Operator> {
    const superAdmin = await this.operatorRepository.findOne({
      where: { email: process.env.ADMIN_EMAIL },
      select: ['id', 'password'],
    });

    if (
      !superAdmin ||
      !(await HashUtil.compare(adminPassword, superAdmin.password))
    ) {
      throw new UnauthorizedException('Invalid admin password');
    }

    if (data.password) {
      data.password = await HashUtil.hash(data.password);
    }

    await this.operatorRepository.update(id, data);
    const updatedOperator = await this.operatorRepository.findOne({
      where: { id },
    });
    if (!updatedOperator) {
      throw new NotFoundException('Operator not found');
    }
    return updatedOperator;
  }

  async deleteOperator(id: string): Promise<void> {
    const operator = await this.findOperator(id);
    await this.operatorRepository.delete(operator.id);
    return;
  }

  async findOperator(id: string): Promise<Operator> {
    const operator = await this.operatorRepository.findOne({ where: { id } });
    if (!operator) {
      throw new NotFoundException('Operator not found');
    }
    return operator;
  }
  async findByEmail(email: string): Promise<Operator | null> {
    const operator = await this.operatorRepository.findOne({
      where: { email },
    });

    return operator;
  }
  async findAllOperators(
    paginationDto: PaginationDto,
    query?: FindOptionsWhere<Operator>,
  ): Promise<PaginatedResponse<Operator>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = query
      ? await this.operatorRepository.findAndCount({
          skip,
          take: limit,
          where: query,
          order: { createdAt: 'DESC' },
        })
      : await this.operatorRepository.findAndCount({
          skip,
          take: limit,
          order: { createdAt: 'DESC' },
        });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
