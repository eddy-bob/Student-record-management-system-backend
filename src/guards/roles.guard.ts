import { Injectable, Dependencies, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/types/operator';
import { ROLES_KEY } from 'src/decorators/roles.decorator';

@Injectable()
@Dependencies(Reflector)
export class RolesGuard {
  reflector: Reflector;
  constructor(reflector: Reflector) {
    this.reflector = reflector;
  }

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role: Role) => user.roles.includes(role));
  }
}
