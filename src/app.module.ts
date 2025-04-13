import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { OperatorModule } from './operator/operator.module';
import { ResultModule } from './result/result.module';
import { StudentModule } from './student/student.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT as string, 10) || 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: (process.env.SYNCHRONIZE as unknown as boolean) || false,
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
  ],
})
export class AppModule {}
