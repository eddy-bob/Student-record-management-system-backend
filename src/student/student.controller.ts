import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { AddStudentDto } from './dto/add-student.dto';
import { Student } from './student.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../type';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { CacheService } from '../common/services/cache.service';
import { Options } from '../type';
@Controller('student')
@UseGuards(RolesGuard)
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private cacheService: CacheService,
  ) {}

  @Post()
  @Roles(Role.Super, Role.Admin, Role.Exco)
  async create(@Body() data: AddStudentDto): Promise<Student> {
    const student = await this.studentService.createStudent(data);
    await this.cacheService.clearCache('/student');
    return student;
  }

  @Patch(':id')
  @Roles(Role.Super, Role.Admin, Role.Exco)
  async update(
    @Param('id') id: string,
    @Body() data: Partial<AddStudentDto>,
  ): Promise<Student> {
    const student = await this.studentService.updateStudent(id, data);
    await this.cacheService.clearCacheByPattern(`/student/${id}|/student\\?`);
    return student;
  }

  @Delete(':id')
  @Roles(Role.Super, Role.Admin)
  async delete(@Param('id') id: string): Promise<void> {
    await this.studentService.deleteStudent(id);
    await this.cacheService.clearCacheByPattern(`/student/${id}|/student\\?`);
  }

  @Get(':id')
  @Roles(Role.Super, Role.Exco, Role.Admin)
  findOne(@Param('id') id: string): Promise<Student> {
    return this.studentService.findStudent(id);
  }

  @Get('')
  @Roles(Role.Super, Role.Exco, Role.Admin)
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('option') option?: Options,
    @Query('admissionSet') admissionSet?: string,
  ): Promise<PaginatedResponse<Student>> {
    const query = {
      ...(option && { option }),
      ...(admissionSet && { admissionSet }),
    };

    return this.studentService.findAllStudents(paginationDto, query);
  }
}
