import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtProvider } from '../../types/jwt';

@Injectable()
export class Jwt implements JwtProvider {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  verifyToken = async (token: string) => {
    try {
      const decoded = this.jwtService.verify(
        token,
        this.configService.get('jwt.secret'),
      );
      if (typeof decoded?.sub === 'undefined') {
        throw new BadRequestException('Invalid token');
      }
      return decoded;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message ? error.message : 'Server Error',
      );
    }
  };
}
