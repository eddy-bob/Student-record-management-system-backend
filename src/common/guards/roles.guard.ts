import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../type'; // Adjust the path as necessary

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // If no roles are specified, allow access
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming user is set in request by auth guard

    // Check if user exists and has the required role
    return user && requiredRoles.some((role) => user.roles?.includes(role));
  }
}
