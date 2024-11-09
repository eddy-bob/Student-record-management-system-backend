import { Module } from '@nestjs/common';
import { OperatorService } from './operator.service';
import { OperatorController } from './operator.controller';
import { Operator } from './entities/operator.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from 'src/permission/operator.permission';

@Module({
  imports: [TypeOrmModule.forFeature([Operator])],

  controllers: [OperatorController],
  providers: [OperatorService, CaslAbilityFactory],
  exports: [OperatorService],
})
export class OperatorModule {}
