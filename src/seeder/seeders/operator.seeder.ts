import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operator } from '../../operator/operator.entity';
import { Role } from '../../type';
import { HashUtil } from '../../common/utils/hash.util';
import { Seeder } from '../interfaces/seeder.interface';

@Injectable()
export class OperatorSeeder implements Seeder {
  constructor(
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
  ) {}

  async seed(): Promise<void> {
    try {
      const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
      const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

      if (!superAdminEmail || !superAdminPassword) {
        throw new Error(
          'Super admin credentials not found in environment variables',
        );
      }

      // Check if super admin already exists
      const existingSuperAdmin = await this.operatorRepository.findOne({
        where: { email: superAdminEmail },
      });

      if (existingSuperAdmin) {
        console.log('Super admin already exists');
        return;
      }

      // Create super admin
      const hashedPassword = await HashUtil.hash(superAdminPassword);
      const superAdmin = this.operatorRepository.create({
        email: superAdminEmail,
        password: hashedPassword,
        role: Role.Super,
        firstName: 'Super',
        lastName: 'Admin',
      });

      await this.operatorRepository.save(superAdmin);
      console.log('Super admin created successfully');
    } catch (error) {
      console.error('Error seeding super admin:', error);
      throw error;
    }
  }

  async drop(): Promise<void> {
    try {
      await this.operatorRepository.delete({ role: Role.Super });
      console.log('Super admin dropped successfully');
    } catch (error) {
      console.error('Error dropping super admin:', error);
      throw error;
    }
  }
}
