import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/app/course/entities/course.entity';
import { Repository } from 'typeorm';
import { COURSES } from './data';

@Injectable()
export class CourseSeederService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async create() {
    const existingCourses = await this.courseRepository.find();

    if (existingCourses) {
      return existingCourses;
    }

    const courses = this.courseRepository.create(COURSES);

    return await this.courseRepository.save(courses);
  }
}
