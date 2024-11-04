import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles.guard';
import { DatabaseModule } from '../database/database.module';
import { AppService } from './app.service';
import configuration from '../config/configuration';
import { BullModule } from '@nestjs/bull';
import { RATE_LIMIT, RATE_LIMIT_TIMEOUT } from 'src/constants';
import { ThrottlerModule } from '@nestjs/throttler';
import { getRedisConfiguration } from 'src/config/redis-configuration';
import { OperatorModule } from './operator/operator.module';
import { WinstonLoggerService } from 'src/logger/winston-logger/winston-logger.service';
import { ErrorsInterceptor } from 'src/interceptor/error.interceptor';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { CourseModule } from './course/course.module';
import { ResultModule } from './result/result.module';
import { JwtStrategy } from 'src/guards/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { RedisClientOptions } from 'redis';
import { Result } from './result/entities/result.entity';
import { Student } from './student/entities/student.entity';
import { Course } from './course/entities/course.entity';
import { CacheModule} from '@nestjs/cache-manager';
import { RequestLoggingInterceptor } from 'src/interceptor/request-logging.interceptor';
import { CACHE_EXPIRATION, CACHE_MAX } from 'src/constants';
import redisStore from 'cache-manager-redis-store';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CustomCacheInterceptor } from 'src/interceptor/cache.interceptor';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configuration],
    }),

    TypeOrmModule.forFeature([Course, Result, Student]),
    BullModule.forRoot({
      redis: getRedisConfiguration(configuration()),
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      ttl: CACHE_EXPIRATION,
      max: CACHE_MAX,
      isGlobal: true,
      ...getRedisConfiguration(configuration()),
    }),

    ThrottlerModule.forRoot([
      {
        ttl: RATE_LIMIT_TIMEOUT || 60000,
        limit: RATE_LIMIT || 10,
      },
    ]),
    DatabaseModule,
    OperatorModule,
    AuthModule,
    StudentModule,
    CourseModule,
    ResultModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    WinstonLoggerService,

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomCacheInterceptor,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
  ],
})
export class AppModule {}
