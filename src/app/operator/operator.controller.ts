import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { Operator } from './entities/operator.entity';
import { OperatorService } from './operator.service';
import { FindOptionsWhere } from 'typeorm';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import {
  UpdateOperatorAsSuperDto,
  UpdateOperatorDto,
} from './dto/update-operator.dto';

@Controller('operator')
export class OperatorController {
  constructor(private readonly operatorService: OperatorService) {}

  @Post()
  create(
    @Body() createOperatorDto: CreateOperatorDto,
    @CurrentUser() operator: Operator,
  ) {
    return this.operatorService.create(createOperatorDto, operator);
  }

  @Get()
  findAll(@Query() options: FindOptionsWhere<Operator>) {
    return this.operatorService.find(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operatorService.findOne(id);
  }
  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @Body() updateOperatorDto: UpdateOperatorAsSuperDto,
  ) {
    return this.operatorService.updateOne(id, updateOperatorDto);
  }

  @Patch('self')
  updateSelf(
    @CurrentUser() user: Operator,
    @Body() updateOperatorDto: UpdateOperatorDto,
  ) {
    return this.operatorService.updateSelf(user, updateOperatorDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.operatorService.deleteOne(id);
  }
}
