import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from '../operator/operator.entity'; // Adjust the path as necessary
import { RateLimiterModule } from 'nestjs-rate-limiter'; // Import the rate limiter module
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthThrottleGuard } from './auth-throttle.guard'; // Import the throttle guard
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([Operator]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    RateLimiterModule.forRoot({
      points: parseInt(process.env.RATE_LIMIT_MAX, 10), // Number of requests
      duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) / 1000, // Time window in seconds
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthThrottleGuard, // Apply the throttle guard globally for this module
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
