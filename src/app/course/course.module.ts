import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { BullModule } from '@nestjs/bull';
import { EVENT_QUEUE } from 'src/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CaslAbilityFactory } from 'src/permission/operator.permission';
@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    BullModule.registerQueue({
      name: EVENT_QUEUE,
    }),
  ],
  controllers: [CourseController],
  providers: [CourseService, CaslAbilityFactory],
})
export class CourseModule {}
