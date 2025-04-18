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
  Inject,
} from '@nestjs/common';
import { ResultService } from './result.service';
import { Result } from './result.entity';
import { AddResultDto } from './dto/add-result.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../type';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { CacheService } from '../common/services/cache.service';
import { Options, Level, Semester } from '../type';
@Controller('result')
@UseGuards(RolesGuard)
export class ResultController {
  constructor(
    private readonly resultService: ResultService,
    private cacheService: CacheService,
  ) {}

  @Post()
  @Roles(Role.Super, Role.Admin) // Only Super Admin and Admin can create results
  async create(@Body() data: AddResultDto): Promise<Result> {
    const result = await this.resultService.createResult(data);
    await this.cacheService.clearCache('/result');
    return result;
  }

  @Patch(':id')
  @Roles(Role.Super) // Only Super Admin can update results
  async update(
    @Param('id') id: string,
    @Body() data: Partial<AddResultDto>,
  ): Promise<Result> {
    const result = await this.resultService.updateResult(id, data);
    await this.cacheService.clearCacheByPattern(`/result/${id}|/result\\?`);
    return result;
  }

  @Delete(':id')
  @Roles(Role.Super, Role.Admin) // Only Super Admin and Admin can delete results
  async delete(@Param('id') id: string): Promise<void> {
    await this.resultService.deleteResult(id);
    await this.cacheService.clearCacheByPattern(`/result/${id}|/result\\?`);
  }

  @Get(':id')
  @Roles(Role.Super, Role.Exco, Role.Admin)
  findOne(@Param('id') id: string): Promise<Result> {
    return this.resultService.findResult(id);
  }

  @Get()
  @Roles(Role.Super, Role.Exco, Role.Admin)
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('option') option?: Options,
    @Query('session') session?: string,
    @Query('level') level?: Level,
    @Query('semester') semester?: Semester,
  ): Promise<PaginatedResponse<Result>> {
    const query = {
      ...(option && { option }),
      ...(session && { session }),
      ...(level && { level }),
      ...(semester && { semester }),
    };

    return this.resultService.findAllResults(paginationDto, query);
  }
}
