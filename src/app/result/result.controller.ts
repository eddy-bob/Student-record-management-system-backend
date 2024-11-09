import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  UsePipes,
  Delete,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { ResultService } from './result.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { Semester, Level, Options } from 'src/types/course';
import { ObjectValidationPipe } from 'src/pipes/isValidEntityObject';
import { Student } from '../student/entities/student.entity';
import { Course } from '../course/entities/course.entity';
import { DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { Role } from 'src/types/operator';
import { Roles } from 'src/decorators/roles.decorator';
import { PoliciesGuard } from 'src/guards/policy.guard';
import { UseGuards } from '@nestjs/common';
import { CheckPolicies } from 'src/decorators/checkPolicy.decorator';
import { AppAbility } from 'src/permission/operator.permission';
import { Action } from 'src/types/operator';
import { Result } from './entities/result.entity';
@SkipThrottle()
@Controller('result')
export class ResultController {
  constructor(
    private readonly resultService: ResultService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Result))
  @Roles(Role.Super, Role.Admin)
  @UsePipes(
    new ObjectValidationPipe(Student, 'student'),
    new ObjectValidationPipe(Course, 'course'),
  )
  create(
    @Body()
    createResultDto: CreateResultDto[],
  ) {
    return this.resultService.create(createResultDto);
  }

  @Get()
  @Roles(Role.Super, Role.Admin)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Result))
  findAll(
    @Query()
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.resultService.findAll(options, {
      page,
      limit,
      route: this.configService.get<string>('siteUrl'),
    });
  }

  @Get(':id')
  @Roles(Role.Super, Role.Admin)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Result))
  findOne(@Param('id') id: string) {
    return this.resultService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Super, Role.Admin)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Result))
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
    return this.resultService.update(id, updateResultDto);
  }

  @Delete(':id')
  @Roles(Role.Super, Role.Admin)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Result))
  remove(@Param('id') id: string) {
    return this.resultService.remove(id);
  }
}
