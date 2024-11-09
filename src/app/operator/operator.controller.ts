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
import { Role } from 'src/types/operator';
import { Roles } from 'src/decorators/roles.decorator';
import {
  UpdateOperatorAsSuperDto,
  UpdateOperatorDto,
} from './dto/update-operator.dto';
import { PoliciesGuard } from 'src/guards/policy.guard';
import { UseGuards } from '@nestjs/common';
import { CheckPolicies } from 'src/decorators/checkPolicy.decorator';
import { AppAbility } from 'src/permission/operator.permission';
import { Action } from 'src/types/operator';
@Controller('operator')
export class OperatorController {
  constructor(private readonly operatorService: OperatorService) {}

  @Post()
  @Roles(Role.Super)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Operator))
  create(
    @Body() createOperatorDto: CreateOperatorDto,
    @CurrentUser() operator: Operator,
  ) {
    return this.operatorService.create(createOperatorDto, operator);
  }

  @Get()
  @Roles(Role.Super)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Operator))
  findAll(@Query() options: FindOptionsWhere<Operator>) {
    return this.operatorService.find(options);
  }

  @Get('single/:id')
  @Roles(Role.Super)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Operator))
  findOne(@Param('id') id: string) {
    return this.operatorService.findOne(id);
  }

  @Get('profile')
  @Roles(Role.Super, Role.Admin, Role.Exco)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Operator))
  fetchProfile(@CurrentUser() operator: Operator) {
    return operator;
  }

  @Patch('single/:id')
  @Roles(Role.Super)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Operator))
  updateOne(
    @Param('id') id: string,
    @Body() updateOperatorDto: UpdateOperatorAsSuperDto,
  ) {
    return this.operatorService.updateOne(id, updateOperatorDto);
  }

  @Patch('self')
  @Roles(Role.Super, Role.Admin, Role.Exco)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Operator))
  updateSelf(
    @CurrentUser() user: Operator,
    @Body() updateOperatorDto: UpdateOperatorDto,
  ) {
    return this.operatorService.updateSelf(user, updateOperatorDto);
  }

  @Delete(':id')
  @Roles(Role.Super)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Operator))
  delete(@Param('id') id: string) {
    return this.operatorService.deleteOne(id);
  }
}
