import { Module } from '@nestjs/common';
import { Course } from 'src/app/course/entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseSeederService } from './course.service';
@Module({
  imports: [TypeOrmModule.forFeature([Course]),],
  providers: [CourseSeederService],
  exports: [CourseSeederService],
})
export class CourseSeederModule {}
