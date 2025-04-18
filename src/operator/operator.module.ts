import { Module } from '@nestjs/common';
import { OperatorService } from './operator.service';
import { OperatorController } from './operator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from './operator.entity';
import { CacheService } from 'src/common/services/cache.service';
@Module({
  imports: [TypeOrmModule.forFeature([Operator])],
  providers: [OperatorService, CacheService],
  controllers: [OperatorController],
  exports: [OperatorService],
})
export class OperatorModule {}
