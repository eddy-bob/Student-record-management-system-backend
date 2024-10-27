import { Module } from '@nestjs/common';
import { Seeder } from './seeder';
import { CourseSeederModule } from './course/course.module';
import { OperatorSeederModule } from './operator/operator.module';
import { MysqlDatabaseProviderModule } from '../providers/database.provider.module';
@Module({
  imports: [
    CourseSeederModule,
    OperatorSeederModule,
    MysqlDatabaseProviderModule,
  ],

  providers: [Seeder],
  exports: [Seeder],
})
export class SeederModule {}
