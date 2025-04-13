import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Course } from './course.entity';
import { AddCourseDto } from './dto/add-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { Options, Level, Semester } from '../type';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async createCourse(data: AddCourseDto): Promise<Course> {
    const course = this.courseRepository.create(data);
    return this.courseRepository.save(course);
  }

  async updateCourse(
    id: string,
    data: Partial<UpdateCourseDto>,
  ): Promise<Course> {
    const course = await this.findCourse(id);
    await this.courseRepository.update(course.id, data);
    const updatedCourse = await this.courseRepository.findOne({
      where: { id },
    });

    return updatedCourse as Course;
  }

  async deleteCourse(id: string): Promise<void> {
    const course = await this.findCourse(id);
    await this.courseRepository.delete(course.id);
    return;
  }

  async findCourse(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async findAllCourses(
    paginationDto: PaginationDto,
    query?: {
      option?: Options;
      level?: Level;
      semester?: Semester;
    },
  ): Promise<PaginatedResponse<Course>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Course> = {};

    if (query) {
      if (query.option) {
        where.option = query.option;
      }
      if (query.level) {
        where.level = query.level;
      }
      if (query.semester) {
        where.semester = query.semester;
      }
    }

    const [data, total] = await this.courseRepository.findAndCount({
      skip,
      take: limit,
      where,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
