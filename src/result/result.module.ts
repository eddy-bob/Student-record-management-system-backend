import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './result.entity';
import { Student } from '../student/student.entity';
import { Course } from '../course/course.entity';
import { StudentService } from '../student/student.service';
import { CacheModule } from '@nestjs/cache-manager';
import { CourseService } from '../course/course.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { CacheService } from 'src/common/services/cache.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Result, Student, Course]),
    ConfigModule.forRoot({
      isGlobal: true, // so it's available app-wide
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService, cacheService: CacheService) => ({
        ttl: 60000 * 5, // milliseconds
        isGlobal: true,
        store: config.get<string>('STORE'),
        host: config.get<string>('STORE_HOST'),
        port: config.get<number>('STORE_PORT'),
      }),
    }),
  ],
  providers: [ResultService, StudentService, CourseService, CacheService],
  controllers: [ResultController],
})
export class ResultModule {}
