import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OperatorService } from '../app/operator/operator.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const operator = await this.authService.validateUser(email, password);

    if (!operator) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return operator;
  }
}
