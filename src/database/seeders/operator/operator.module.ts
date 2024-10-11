import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperatorSeederService } from './operator.service';
import { Operator } from 'src/app/operator/entities/operator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operator])],
  providers: [OperatorSeederService],
  exports: [OperatorSeederService],
})
export class OperatorSeederModule {}
