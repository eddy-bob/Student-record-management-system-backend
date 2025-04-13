import { Module } from '@nestjs/common';
import { OperatorService } from './operator.service';
import { OperatorController } from './operator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from './operator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operator])],
  providers: [OperatorService],
  controllers: [OperatorController],
})
export class OperatorModule {}
