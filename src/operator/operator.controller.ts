import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { OperatorService } from './operator.service';
import { CacheService } from '../common/services/cache.service';

import { AddOperatorDto } from './dto/add-operator.dto';
import { Operator } from './operator.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../type';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';

@Controller('operator')
@UseGuards(RolesGuard)
export class OperatorController {
  constructor(
    private readonly operatorService: OperatorService,
    private readonly cacheService: CacheService,
  ) {}

  @Post()
  @Roles(Role.Super)
  async create(
    @Body() data: AddOperatorDto,
    @Body('adminPassword') adminPassword: string,
  ): Promise<Operator> {
    const operator = await this.operatorService.createOperator(
      data,
      adminPassword,
    );
    await this.cacheService.clearCache('/operator');
    return operator;
  }

  @Patch(':id')
  @Roles(Role.Super)
  async update(
    @Param('id') id: string,
    @Body() data: Partial<AddOperatorDto>,
    @Body('adminPassword') adminPassword: string,
  ): Promise<Operator> {
    const operator = await this.operatorService.updateOperator(
      id,
      data,
      adminPassword,
    );
    await this.cacheService.clearCacheByPattern(`/operator/${id}|/operator\\?`);
    return operator;
  }

  @Delete(':id')
  @Roles(Role.Super)
  async delete(@Param('id') id: string): Promise<void> {
    await this.operatorService.deleteOperator(id);
    await this.cacheService.clearCacheByPattern(`/operator/${id}|/operator\\?`);
  }

  @Get(':id')
  @Roles(Role.Super, Role.Exco, Role.Admin)
  findOne(@Param('id') id: string): Promise<Operator> {
    return this.operatorService.findOperator(id);
  }

  @Get()
  @Roles(Role.Super, Role.Exco, Role.Admin)
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() query: FindOptionsWhere<Operator>,
  ): Promise<PaginatedResponse<Operator>> {
    return this.operatorService.findAllOperators(paginationDto, query);
  }
  @Get('profile')
  @Roles(Role.Super, Role.Exco, Role.Admin)
  getCurrentUser(@CurrentUser() user: Operator): Promise<Operator> {
    return this.operatorService.findOperator(user.id);
  }
}
