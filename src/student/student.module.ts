import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { CacheService } from 'src/common/services/cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [StudentService, CacheService],
  controllers: [StudentController],
  exports: [StudentService],
})
export class StudentModule {}
