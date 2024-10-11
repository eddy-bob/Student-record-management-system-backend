import { Module } from '@nestjs/common';
import { Course } from 'src/app/course/entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EVENT_QUEUE } from 'src/constants';
import { CourseSeederService } from './course.service';
import { BullModule } from '@nestjs/bull';
@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    BullModule.registerQueue({
      name: EVENT_QUEUE,
    }),
  ],
  providers: [CourseSeederService],
  exports: [CourseSeederService],
})
export class CourseSeederModule {}
