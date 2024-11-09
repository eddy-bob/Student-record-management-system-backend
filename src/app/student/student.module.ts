import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from './entities/student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { EVENT_QUEUE } from 'src/constants';
import { CaslAbilityFactory } from 'src/permission/operator.permission';
@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),

    BullModule.registerQueue({
      name: EVENT_QUEUE,
    }),
  ],
  controllers: [StudentController],
  providers: [StudentService, CaslAbilityFactory],
})
export class StudentModule {}
