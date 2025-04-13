import { Injectable } from '@nestjs/common';
import { OperatorService } from '../../operator/operator.service';
import { Role } from '../../type';
import { AddOperatorDto } from 'src/operator/dto/add-operator.dto';

@Injectable()
export class SeederService {
  constructor(private readonly operatorService: OperatorService) {}

  async seedSuperAdmin(): Promise<void> {
    try {
      const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
      const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

      if (!superAdminEmail || !superAdminPassword) {
        throw new Error(
          'Super admin credentials not found in environment variables',
        );
      }

      // Check if super admin already exists
      const existingSuperAdmin =
        await this.operatorService.findByEmail(superAdminEmail);

      if (existingSuperAdmin) {
        console.log('Super admin already exists');
        return;
      }

      // Create super admin
      const superAdminData: AddOperatorDto = {
        email: superAdminEmail,
        password: superAdminPassword,
        role: Role.Super,
        firstName: 'Super',
        lastName: 'Admin',
        adminPassword: superAdminPassword,
      };

      await this.operatorService.createOperator(
        superAdminData,
        superAdminPassword,
      );
      console.log('Super admin created successfully');
    } catch (error) {
      console.error('Error seeding super admin:', error);
      throw error;
    }
  }
}
