import {
  CREATE_RESULT,
  CREATE_COURSE,
  EVENT_QUEUE,
  CREATE_STUDENT,
} from './constants';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateResultDto } from './app/result/dto/create-result.dto';
import { Student } from './app/student/entities/student.entity';
import { Result } from './app/result/entities/result.entity';
import { Course } from './app/course/entities/course.entity';
import { CreateCourseDto } from './app/course/dto/create-course.dto';
import { CreateStudentDto } from './app/student/dto/create-student.dto';

@Processor(EVENT_QUEUE)
export class MessageConsumer {
  constructor(
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  @Process(CREATE_COURSE)
  async readCreateCourseJob(job: Job<CreateCourseDto[]>) {
    const jobData = job.data;
    const courses = await Promise.all(
      jobData.map(async (dto: CreateCourseDto) => {
        return {
          ...dto,
          unit: parseInt(dto.unit),
        };
      }),
    );

    const data = this.courseRepository.create(courses);
    return await this.courseRepository.save(data);
  }
  @Process(CREATE_STUDENT)
  async readCreateStudentJob(job: Job<CreateStudentDto[]>) {
    const jobData = job.data;
    const students = this.studentRepository.create(jobData);
    return await this.studentRepository.save(students);
  }
  @Process(CREATE_RESULT)
  async readCreateResultJob(job: Job<CreateResultDto[]>) {
    const jobData = job.data;
    const results = await Promise.all(
      jobData.map(async (dto: CreateResultDto) => {
        const student = await this.studentRepository.findOneBy({
          id: dto.student,
        });
        const course = await this.courseRepository.findOneBy({
          id: dto.course,
        });

        return {
          score: parseInt(dto.score),
          student,
          course,
          session: dto.session,
        };
      }),
    );
    const data = this.resultRepository.create(results);
    return await this.resultRepository.save(data);
  }
}
