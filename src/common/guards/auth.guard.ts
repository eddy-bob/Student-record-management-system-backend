import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false; // No token provided
    }

    try {
      const user = await this.jwtService.verifyAsync(token);
      request.user = user; // Attach user to request
      return true;
    } catch (error) {
      return false; // Token is invalid
    }
  }
}
