import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { CacheService } from 'src/common/services/cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
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
  providers: [StudentService, CacheService],
  controllers: [StudentController],
  exports: [StudentService],
})
export class StudentModule {}
