import { Module } from '@nestjs/common';
import { Seeder } from './seeder';
import { CourseSeederModule } from './course/course.module';
import { OperatorSeederModule } from './operator/operator.module';
import { databaseProviders } from '../providers/database.provider';

@Module({
  imports: [CourseSeederModule, OperatorSeederModule],
  providers: [...databaseProviders, Seeder],
  exports: [Seeder, ...databaseProviders],
})
export class SeederModule {}
