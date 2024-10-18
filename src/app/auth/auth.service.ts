import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from 'src/logger/winston-logger/winston-logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Operator } from '../operator/entities/operator.entity';
import { JwtPayload } from 'src/guards/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { SuccessResponse } from 'src/utils/response';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Operator)
    private readonly operatorRepository: Repository<Operator>,
    private readonly configService: ConfigService,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(AuthService.name);
  }
  async validateUser(email: string, enteredPassword: string) {
    const user = await this.operatorRepository
      .createQueryBuilder('operator')
      .where('operator.email = :email', { email })
      .addSelect('operator.password')
      .getOne();

    if (!user) {
      return null;
    }

    const isMatch = await user.matchPassword(enteredPassword);

    if (!isMatch) {
      return null;
    }

    const { password, ...result } = user;

    return result as Operator;
  }

  async signin(user: Operator) {
    const payload: JwtPayload = { sub: user.id, role: user.role };
    const data = {
      user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
      }),
    };

    return new SuccessResponse(data, 'Signin successful');
  }
}
