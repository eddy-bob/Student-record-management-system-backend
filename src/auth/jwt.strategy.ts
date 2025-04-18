import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { OperatorService } from '../operator/operator.service';
import { Operator } from '../operator/operator.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private operatorService: OperatorService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<Operator> {
    // Here we can fetch the user from the database if needed
    const operator = await this.operatorService.findOperator(payload.sub);
    if (!operator) {
      throw new Error('Unauthorized');
    }
    return operator; // This will be attached to request.user
  }
}
