import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { FindOptionsWhere } from 'typeorm';
import { CacheKey } from '@nestjs/cache-manager';

@SkipThrottle()
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto[]) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @CacheKey('all-students')
  findAll(@Query() options: FindOptionsWhere<Student>) {
    return this.studentService.findAll(options);
  }

  @Get()
  findOne(@Query() options: FindOptionsWhere<Student>) {
    return this.studentService.findOne(options);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
