import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Result } from './result.entity';
import { AddResultDto } from './dto/add-result.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { StudentService } from '../student/student.service';
import { CourseService } from '../course/course.service';
import { Options, Level, Semester } from '../type';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result)
    private resultRepository: Repository<Result>,
    private readonly studentService: StudentService,
    private readonly courseService: CourseService,
  ) {}

  async createResult(data: AddResultDto): Promise<Result> {
    const { student, course, ...resultData } = data;

    const studentObj = await this.studentService.findStudent(student);
    const courseObj = await this.courseService.findCourse(course);
    const result = this.resultRepository.create({
      ...resultData,
      student: studentObj,
      course: courseObj,
    });
    return this.resultRepository.save(result);
  }

  async updateResult(id: string, data: Partial<AddResultDto>): Promise<Result> {
    const { student, course, ...rest } = data;
    console.log(student, course);
    const result = await this.findResult(id);
    if (data.score) {
      await this.resultRepository.update(result.id, rest);
    }

    const updatedResult = await this.resultRepository.findOne({
      where: { id },
    });

    return updatedResult as Result;
  }

  async deleteResult(id: string): Promise<void> {
    const result = await this.findResult(id);
    await this.resultRepository.delete(result.id);
    return;
  }

  async findResult(id: string): Promise<Result> {
    const result = await this.resultRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Result not found');
    }
    return result;
  }

  async findAllResults(
    paginationDto: PaginationDto,
    query?: {
      option?: Options;
      session?: string;
      level?: Level;
      semester?: Semester;
    },
  ): Promise<PaginatedResponse<Result>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Result> = {};

    if (query) {
      if (query.session) {
        where.session = query.session;
      }

      // Add course filters
      if (query.level || query.semester || query.option) {
        where.course = {};
        if (query.level) {
          where.course.level = query.level;
        }
        if (query.semester) {
          where.course.semester = query.semester;
        }
        if (query.option) {
          where.course.option = query.option;
        }
      }
    }

    const [data, total] = await this.resultRepository.findAndCount({
      skip,
      take: limit,
      where,
      relations: ['student', 'course'],
      order: { createdAt: 'DESC' },
    });

    return {
      items: data,
      meta: {
        totalPages: total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
