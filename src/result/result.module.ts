import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './result.entity';
import { Student } from '../student/student.entity';
import { Course } from '../course/course.entity';
import { StudentService } from '../student/student.service';
import { CourseService } from '../course/course.service';
import { CacheService } from 'src/common/services/cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([Result, Student, Course])],
  providers: [ResultService, StudentService, CourseService, CacheService],
  controllers: [ResultController],
})
export class ResultModule {}
