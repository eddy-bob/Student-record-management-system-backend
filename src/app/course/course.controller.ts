import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
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
import { Role } from 'src/types/operator';
import { Roles } from 'src/decorators/roles.decorator';
import { PoliciesGuard } from 'src/guards/policy.guard';
import { UseGuards } from '@nestjs/common';
import { CheckPolicies } from 'src/decorators/checkPolicy.decorator';
import { AppAbility } from 'src/permission/operator.permission';
import { Action } from 'src/types/operator';
@SkipThrottle()
@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @Roles(Role.Super, Role.Admin)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Course))
  create(@Body() createCourseDto: CreateCourseDto[]) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @Roles(Role.Super, Role.Admin, Role.Exco)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Course))
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
  @Roles(Role.Super, Role.Admin, Role.Exco)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Course))
  @CacheTTL(10000)
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Super, Role.Admin)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Course))
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }
  @Delete(':id')
  @Roles(Role.Super, Role.Admin)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Course))
  delete(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }
}
