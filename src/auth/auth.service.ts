import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operator } from '../operator/operator.entity';
import { SigninDto } from './dto/signin.dto';
import { HashUtil } from '../common/utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
    private jwtService: JwtService,
  ) {}

  async signin(data: SigninDto): Promise<{ accessToken: string }> {
    const operator = await this.operatorRepository.findOne({
      where: { email: data.email },
      select: ['id', 'email', 'password', 'role'], // Make sure to select password field
    });

    if (
      !operator ||
      !(await HashUtil.compare(data.password, operator.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: operator.id,
      email: operator.email,
      role: operator.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
