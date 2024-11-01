import configuration from 'src/config/configuration';
import { config as envConfig } from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppDataSource } from '../ormconfig';

envConfig();

const config = configuration();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const { migrations, entities, ...rest } = AppDataSource.options;
        return {
          ...rest,
          migrationsRun: true,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class MysqlDatabaseProviderModule {}
