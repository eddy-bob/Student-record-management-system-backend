import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from '../operator/operator.entity'; // Adjust the path as necessary
import { OperatorService } from 'src/operator/operator.service';
import { RateLimiterModule } from 'nestjs-rate-limiter'; // Import the rate limiter module
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthThrottleGuard } from './auth-throttle.guard'; // Import the throttle guard
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([Operator]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE || '60s' },
    }),
    RateLimiterModule.register({
      points: parseInt(process.env.RATE_LIMIT_MAX || '10', 10), // default to 10
      duration:
        parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10) / 1000, // default to 60 seconds
    }),
  ],
  providers: [
    AuthService,
    OperatorService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthThrottleGuard, // Apply the throttle guard globally for this module
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
