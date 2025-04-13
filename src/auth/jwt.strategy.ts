import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { OperatorService } from '../operator/operator.service'; // Adjust the path as necessary
import { Operator } from '../operator/operator.entity'; // Adjust the path as necessary

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private operatorService: OperatorService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_secret_key', // Use the same secret as in JwtModule
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
