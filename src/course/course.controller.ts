import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { AddCourseDto } from './dto/add-course.dto';
import { Course } from './course.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../type';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { CacheService } from '../common/services/cache.service';
import { Options, Level, Semester } from '../type';

@Controller('course')
@UseGuards(RolesGuard)
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly cacheService: CacheService,
  ) {}

  @Post()
  @Roles(Role.Super, Role.Admin)
  async create(@Body() data: AddCourseDto): Promise<Course> {
    const course = await this.courseService.createCourse(data);
    await this.cacheService.clearCache('/course');
    return course;
  }

  @Patch(':id')
  @Roles(Role.Super, Role.Admin, Role.Exco)
  async update(
    @Param('id') id: string,
    @Body() data: Partial<AddCourseDto>,
  ): Promise<Course> {
    const course = await this.courseService.updateCourse(id, data);
    await this.cacheService.clearCacheByPattern(`/course/${id}|/course\\?`);
    return course;
  }

  @Delete(':id')
  @Roles(Role.Super, Role.Admin)
  async delete(@Param('id') id: string): Promise<void> {
    await this.courseService.deleteCourse(id);
    await this.cacheService.clearCacheByPattern(`/course/${id}|/course\\?`);
  }

  @Get(':id')
  @Roles(Role.Super, Role.Exco, Role.Admin)
  findOne(@Param('id') id: string): Promise<Course> {
    return this.courseService.findCourse(id);
  }

  @Get()
  @Roles(Role.Super, Role.Exco, Role.Admin)
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('option') option?: Options,
    @Query('level') level?: Level,
    @Query('semester') semester?: Semester,
  ): Promise<PaginatedResponse<Course>> {
    const query = {
      ...(option && { option }),
      ...(level && { level }),
      ...(semester && { semester }),
    };

    return this.courseService.findAllCourses(paginationDto, query);
  }
}
