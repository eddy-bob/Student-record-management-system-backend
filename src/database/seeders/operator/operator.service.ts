import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SUPER_ADMIN } from './data';
import { Operator } from 'src/app/operator/entities/operator.entity';
import { Role } from 'src/types/operator';
import configuration from 'src/config/configuration';

@Injectable()
export class OperatorSeederService {
  constructor(
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
  ) {}

  async create() {
    const existingSuperAdmin = await this.operatorRepository.findOne({
      where: {
        email: configuration().operator.superAdminEmail,
        role: Role.Super,
      },
    });

    if (existingSuperAdmin) {
      return existingSuperAdmin;
    }

    const superAdmin = this.operatorRepository.create(SUPER_ADMIN);

    return await this.operatorRepository.save(superAdmin);
  }
}
