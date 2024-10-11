import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FindOptionsWhere } from 'typeorm';
import { Course } from './entities/course.entity';
import { DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { CacheTTL, CacheKey } from '@nestjs/cache-manager';

@SkipThrottle()
@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto[]) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @CacheKey('all-courses')
  findAll(
    @Query() options: FindOptionsWhere<Course>,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.courseService.findAll(options, {
      page,
      limit,
      route: this.configService.get<string>('siteUrl'),
    });
  }

  @Get(':id')
  @CacheTTL(10000)
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }
}
