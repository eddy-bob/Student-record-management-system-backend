import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from '../operator/operator.entity'; // Adjust the path as necessary
import { OperatorService } from 'src/operator/operator.service';
import { RateLimiterModule } from 'nestjs-rate-limiter'; // Import the rate limiter module

import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // So config is available globally
    }),
    TypeOrmModule.forFeature([Operator]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRE') }, // Adjust expiration as needed
      }),
    }),

    RateLimiterModule.register({
      points: parseInt(process.env.RATE_LIMIT_MAX || '10', 10), // default to 10
      duration:
        parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10) / 1000, // default to 60 seconds
    }),
  ],
  providers: [AuthService, OperatorService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
