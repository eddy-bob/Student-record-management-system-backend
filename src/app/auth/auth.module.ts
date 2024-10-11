import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthController } from './auth.controller';
import { LocalStrategy } from 'src/guards/local.strategy';
import { JwtStrategy } from 'src/guards/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import configuration from 'src/config/configuration';
@Module({
  imports: [
    PassportModule.register({ session: true }),
    JwtModule.register({
      global: true,
      secret: configuration().jwt.secret,
      signOptions: { expiresIn: configuration().jwt.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
