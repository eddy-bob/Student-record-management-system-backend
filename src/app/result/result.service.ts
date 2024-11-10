import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { Result } from './entities/result.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponse } from 'src/utils/response';
import pagination from 'src/utils/paginate';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Level, Options, Semester } from 'src/types/course';
import { CREATE_RESULT, EVENT_QUEUE } from 'src/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
@Injectable()
export class ResultService {
  constructor(
    @InjectQueue(EVENT_QUEUE)
    private readonly queue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
  ) {}

  async create(createResultDto: CreateResultDto[]) {
    try {
      // delete cached results
      // await this.cacheManager.delete(`all-results`);
      return (await this.queue.add(CREATE_RESULT, createResultDto)).finished();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async findAll(
    options: {
      student?: string;
      course?: string;
      courseCode?: string;
      regNumber?: string;
      semester?: Semester;
      level?: Level;
      option?: Options;
      session?: string;
    },
    paginationOptions: IPaginationOptions,
  ) {
    // available queries are course and student
    const queryBuilder = this.resultRepository.createQueryBuilder('result');
    queryBuilder.leftJoin('result.student', 'student');
    queryBuilder.leftJoinAndSelect('result.course', 'course');
    queryBuilder.addSelect('student.id');
    queryBuilder.addSelect('student.regNumber');
    queryBuilder.addSelect('student.firstName');
    queryBuilder.addSelect('student.lastName');
    queryBuilder.addSelect('student.middleName');
    if (options.course) {
      queryBuilder.where('course.id =:courseId', {
        courseId: options.course,
      });
    }
    if (options.student) {
      queryBuilder.andWhere('student.id =:studentId', {
        studentId: options.student,
      });
    }
    if (options.courseCode) {
      queryBuilder.andWhere('course.courseCode =:courseCode', {
        courseCode: options.courseCode,
      });
    }
    if (options.regNumber) {
      queryBuilder.andWhere('student.regNumber =:regNumber', {
        regNumber: options.regNumber,
      });
    }
    if (options.semester) {
      queryBuilder.andWhere('course.semester =:semester', {
        semester: options.semester,
      });
    }
    if (options.level) {
      queryBuilder.andWhere('course.level =:level', {
        level: options.level,
      });
    }
    if (options.option) {
      queryBuilder.andWhere('course.option =:option', {
        option: options.option,
      });
    }
    if (options.session) {
      queryBuilder.andWhere('result.session=:session', {
        session: options.session,
      });
    }
    // Order by course code
    queryBuilder.orderBy('course.courseCode', 'ASC');
    return pagination<Result>(queryBuilder, paginationOptions);
  }

  async findOne(id: string) {
    const result = await this.resultRepository.findOneBy({ id });
    if (!result)
      throw new NotFoundException(
        `Course with provided id ${id} does not exist`,
      );
    return result;
  }

  async update(id: string, updateResultDto: UpdateResultDto) {
    const isResult = await this.findOne(id);

    const updatedResult = await this.resultRepository.update(isResult.id, {
      ...updateResultDto,
      score: parseInt(updateResultDto.score),
    });
    // delete cached results
    // await this.cacheManager.delete(`result/${id}`);
    // await this.cacheManager.delete(`all-results`);
    return updatedResult;
  }

  async remove(id: string) {
    const result = await this.findOne(id);
    await this.resultRepository.delete(result.id);
    // delete cached results
    // await this.cacheManager.delete(`result/${id}`);
    // await this.cacheManager.delete(`all-results`);
    return new SuccessResponse({}, `Result with id ${id} deleted successfully`);
  }
}
