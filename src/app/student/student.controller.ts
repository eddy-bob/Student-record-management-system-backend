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
import { PoliciesGuard } from 'src/guards/policy.guard';
import { UseGuards } from '@nestjs/common';
import { CheckPolicies } from 'src/decorators/checkPolicy.decorator';
import { AppAbility } from 'src/permission/operator.permission';
import { Action } from 'src/types/operator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/types/operator';
import { ConfigService } from '@nestjs/config';
import { DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
@SkipThrottle()
@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @Roles(Role.Super, Role.Admin, Role.Exco)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Student))
  create(@Body() createStudentDto: CreateStudentDto[]) {
    return this.studentService.create(createStudentDto);
  }

  @Get('all')
  @Roles(Role.Super, Role.Admin, Role.Exco)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Student))
  findAll(
    @Query() options: FindOptionsWhere<Student>,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.studentService.findAll(options, {
      page,
      limit,
      route: this.configService.get<string>('siteUrl'),
    });
  }

  @Get()
  @Roles(Role.Super, Role.Admin, Role.Exco)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Student))
  findOne(@Query() options: FindOptionsWhere<Student>) {
    return this.studentService.findOne(options);
  }

  @Patch(':id')
  @Roles(Role.Super, Role.Admin, Role.Exco)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Student))
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(Role.Super)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Student))
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
