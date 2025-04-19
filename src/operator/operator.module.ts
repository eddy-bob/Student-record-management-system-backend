import { Module } from '@nestjs/common';
import { OperatorService } from './operator.service';
import { OperatorController } from './operator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from './operator.entity';
import { CacheService } from 'src/common/services/cache.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forFeature([Operator]),
    ConfigModule.forRoot({
      isGlobal: true, // so it's available app-wide
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService, cacheService: CacheService) => ({
        ttl: 60000 * 5, // milliseconds
        isGlobal: true,
        store: config.get<string>('STORE'),
        host: config.get<string>('STORE_HOST'),
        port: config.get<number>('STORE_PORT'),
      }),
    }),
  ],
  providers: [OperatorService, CacheService],
  controllers: [OperatorController],
  exports: [OperatorService],
})
export class OperatorModule {}
