import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from '../operator/operator.entity';
import { Course } from '../course/course.entity';
import { OperatorSeeder } from './seeders/operator.seeder';
import { CourseSeeder } from './seeders/course.seeder';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes config available app-wide
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('MYSQL_HOST'),
        port: parseInt(config.get<string>('MYSQL_PORT') || '3306', 10),
        username: config.get<string>('MYSQL_USER'),
        password: config.get<string>('MYSQL_PASSWORD'),
        database: config.get<string>('MYSQL_DATABASE'),
        entities: [Operator, Course],
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([Operator, Course]),
  ],
  providers: [OperatorSeeder, CourseSeeder],
})
export class SeederModule {}
