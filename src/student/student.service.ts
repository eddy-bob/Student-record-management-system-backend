import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Student } from './student.entity';
import { AddStudentDto } from './dto/add-student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { Options } from '../type';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async createStudent(data: AddStudentDto): Promise<Student> {
    const student = this.studentRepository.create(data);
    return this.studentRepository.save(student);
  }

  async updateStudent(
    id: string,
    data: Partial<AddStudentDto>,
  ): Promise<Student> {
    const student = await this.findStudent(id);
    await this.studentRepository.update(student.id, data);
    const updatedStudent = await this.studentRepository.findOne({
      where: { id },
    });

    return updatedStudent as Student;
  }

  async deleteStudent(id: string): Promise<void> {
    const student = await this.findStudent(id);
    await this.studentRepository.delete(student.id);
    return;
  }

  async findStudent(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException('Student record does not exist or deleted');
    }
    return student;
  }

  async findAllStudents(
    paginationDto: PaginationDto,
    query?: {
      option?: Options;
      admissionSet?: string;
    },
  ): Promise<PaginatedResponse<Student>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Student> = {};

    if (query) {
      if (query.option) {
        where.option = query.option;
      }
      if (query.admissionSet) {
        where.admissionSet = query.admissionSet;
      }
    }

    const [data, total] = await this.studentRepository.findAndCount({
      skip,
      take: limit,
      where,
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
