import {
  Injectable,
  NotFoundException,
  HttpException,
  Query,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import pagination from 'src/utils/paginate';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CREATE_COURSE, EVENT_QUEUE } from 'src/constants';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { SuccessResponse } from 'src/utils/response';

@Injectable()
export class CourseService {
  constructor(
    @InjectQueue(EVENT_QUEUE)
    private readonly queue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}
  async create(createCourseDto: CreateCourseDto[]) {
    try {
      // delete cached courses so new instance containing new course will be included on next fetch
      await this.cacheManager.delete(`all-courses`);
      return (await this.queue.add(CREATE_COURSE, createCourseDto)).finished();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async findAll(
    @Query() options: FindOptionsWhere<Course>,
    paginationOptions: IPaginationOptions,
  ) {
    // available queries are course and student
    const queryBuilder = this.courseRepository.createQueryBuilder('course');
    if (options.id) {
      queryBuilder.where('result.id=:id', {
        id: options.id,
      });
    }
    if (options.option) {
      queryBuilder.where('result.option=:option', {
        option: options.option,
      });
    }
    if (options.semester) {
      queryBuilder.where('result.semester=:semester', {
        semester: options.semester,
      });
    }
    if (options.level) {
      queryBuilder.where('result.level=:level', {
        level: options.level,
      });
    }
    return pagination<Course>(queryBuilder, paginationOptions);
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course)
      throw new NotFoundException(
        `Course with provided id ${id} does not exist`,
      );
    return course;
  }

  async deleteCourse(id: string) {
    const isCourse = await this.findOne(id);
    if (!isCourse)
      throw new NotFoundException(`course with id ${id} does  not exist`);
    await this.courseRepository.delete(id);
    return new SuccessResponse({}, 'Course deleted successfully');
  }
  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const isCourse = await this.findOne(id);
    // delete cached course/courses
    await this.cacheManager.delete(`course/${id}`);
    await this.cacheManager.delete(`all-courses`);
    return await this.courseRepository.update(isCourse.id, {
      ...updateCourseDto,
      unit: parseInt(updateCourseDto.unit),
    });
  }
}
