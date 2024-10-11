import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { Result } from './entities/result.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../student/entities/student.entity';
import { Course } from '../course/entities/course.entity';
import { BullModule } from '@nestjs/bull';
import { EVENT_QUEUE } from 'src/constants';
import { MessageConsumer } from 'src/message.consumer';
@Module({
  imports: [
    TypeOrmModule.forFeature([Result, Student, Course]),

    BullModule.registerQueue({
      name: EVENT_QUEUE,
    }),
  ],
  controllers: [ResultController],
  providers: [ResultService, MessageConsumer],
})
export class ResultModule {}
