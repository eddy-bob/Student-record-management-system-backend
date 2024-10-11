import { Operator } from 'src/app/operator/entities/operator.entity';
import { Role } from 'src/types/operator';
import configuration from 'src/config/configuration';

const config = configuration();

export const SUPER_ADMIN: Partial<Operator> = {
  email: config.operator.superAdminEmail,
  password: config.operator.superAdminEmail,
  role: Role.Super,
};
