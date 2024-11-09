import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { SuccessResponse } from 'src/utils/response';
import { CREATE_STUDENT, EVENT_QUEUE } from 'src/constants';
import { HttpException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import pagination from 'src/utils/paginate';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
@Injectable()
export class StudentService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue(EVENT_QUEUE)
    private readonly queue: Queue,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}
  async create(createStudentDto: CreateStudentDto[]) {
    try {
      return (
        await this.queue.add(CREATE_STUDENT, createStudentDto)
      ).finished();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async findAll(
    options: FindOptionsWhere<Student>,
    paginationOptions: IPaginationOptions,
  ) {
    const queryBuilder = this.studentRepository.createQueryBuilder('student');

    if (options.admissionSet) {
      queryBuilder.where('student.admissionSet =:admissionSet', {
        admissionSet: options.admissionSet,
      });
    }
    if (options.option) {
      queryBuilder.where('student.option =:option', {
        option: options.option,
      });
    }
    // Order by course code
    queryBuilder.orderBy('student.firstName', 'ASC');
    return pagination<Student>(queryBuilder, paginationOptions);
  }

  async findOne(options: FindOptionsWhere<Student>) {
    console.log(options);
    const student = await this.studentRepository.findOneBy(options);
    if (!student)
      throw new NotFoundException(
        'Student with provided credentials not found',
      );
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const isStudent = await this.findOne({ id });
    // delete cached students
    await this.cacheManager.del(`student/${id}`);
    await this.cacheManager.del(`all-students`);
    return await this.studentRepository.update(isStudent.id, updateStudentDto);
  }

  async remove(id: string) {
    const student = await this.findOne({ id });
    // delete cached students
    await this.cacheManager.del(`student/${id}`);
    await this.cacheManager.del(`all-students`);
    await this.studentRepository.delete(student.id);
    return new SuccessResponse(
      {},
      `Student with id ${id} deleted successfully`,
    );
  }
}
