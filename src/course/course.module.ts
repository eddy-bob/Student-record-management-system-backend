import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Course } from './course.entity';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CacheService } from 'src/common/services/cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [CourseService, CacheService],
  controllers: [CourseController],
  exports: [CourseService],
})
export class CourseModule {}
