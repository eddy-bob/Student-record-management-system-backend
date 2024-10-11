import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { Operator } from './entities/operator.entity';
import { OperatorService } from './operator.service';
import { FindOptionsWhere } from 'typeorm';
import { CreateOperatorDto } from './dto/create-operator.dto';

@Controller('operator')
export class OperatorController {
  constructor(private readonly operatorService: OperatorService) {}

  @Post()
  create(@Body() createOperatorDto: CreateOperatorDto) {
    return this.operatorService.create(createOperatorDto);
  }

  @Get()
  findAll(@Query() options: FindOptionsWhere<Operator>) {
    return this.operatorService.find(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operatorService.findOne(id);
  }

  @Delete(':id')
  update(@Param('id') id: string) {
    return this.operatorService.deleteOne(id);
  }
}
