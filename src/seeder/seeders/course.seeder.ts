import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../course/course.entity';
import { Seeder } from '../interfaces/seeder.interface';
import { COURSE_SEED_DATA } from '../constants/course.seed.data';

@Injectable()
export class CourseSeeder implements Seeder {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async seed(): Promise<void> {
    try {
      for (const courseData of COURSE_SEED_DATA) {
        const existingCourse = await this.courseRepository.findOne({
          where: {
            courseCode: courseData.courseCode,
            title: courseData.title,
            option: courseData.option,
          },
        });

        if (!existingCourse) {
          const course = this.courseRepository.create({
            courseCode: courseData.courseCode,
            title: courseData.title,
            unit: courseData.unit,
            level: courseData.level,
            semester: courseData.semester,
            option: courseData.option,
          });
          await this.courseRepository.save(course);
          console.log(`Course ${courseData.courseCode} created successfully`);
        } else {
          console.log(`Course ${courseData.courseCode} already exists`);
        }
      }
      console.log('All courses seeded successfully');
    } catch (error) {
      console.error('Error seeding courses:', error);
      throw error;
    }
  }

  async drop(): Promise<void> {
    try {
      await this.courseRepository.delete({});
      console.log('All courses dropped successfully');
    } catch (error) {
      console.error('Error dropping courses:', error);
      throw error;
    }
  }
}
