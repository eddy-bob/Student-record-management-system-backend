import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from '../operator/operator.entity';
import { Course } from '../course/course.entity';
import { OperatorSeeder } from './seeders/operator.seeder';
import { CourseSeeder } from './seeders/course.seeder';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT as string, 10) || 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [Operator, Course],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Operator, Course]),
  ],
  providers: [OperatorSeeder, CourseSeeder],
})
export class SeederModule {}
