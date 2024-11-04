import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OperatorService } from 'src/app/operator/operator.service';
import { Operator } from 'src/app/operator/entities/operator.entity';
import { Role } from 'src/types/operator';
export interface JwtPayload {
  sub: string;
  role: Role;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly operatorService: OperatorService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt.secret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    let user: Operator;
    try {
      user = await this.operatorService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Unauthorized');
      }
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
