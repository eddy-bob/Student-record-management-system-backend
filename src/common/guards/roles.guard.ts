import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../type'; // Adjust the path as necessary

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
    console.log('ran');
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user, console.log(requiredRoles));
    // Check if user exists and has the required role
    return user && requiredRoles.includes(user.role);
  }
}
