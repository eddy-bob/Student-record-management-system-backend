import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { OperatorModule } from './operator/operator.module';
import { ResultModule } from './result/result.module';
import { StudentModule } from './student/student.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { AuthThrottleGuard } from './auth/auth-throttle.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // so it's available app-wide
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRE') }, // Adjust expiration as needed
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('MYSQL_HOST'),
        port: parseInt(config.get<string>('MYSQL_PORT') || '3306', 10),
        username: config.get<string>('MYSQL_USER'),
        password: config.get<string>('MYSQL_PASSWORD'),
        database: config.get<string>('MYSQL_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    ThrottlerModule.forRoot(),
    CacheModule.register({
      ttl: 60000 * 5, // milliseconds
      isGlobal: true,
    }),
    AuthModule,
    CourseModule,
    OperatorModule,
    ResultModule,
    StudentModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthThrottleGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Apply the throttle guard globally for this module
    },
    JwtStrategy,
  ],
})
export class AppModule {}
