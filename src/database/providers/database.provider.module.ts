import { DataSource } from 'typeorm';
import { DATA_SOURCE } from 'src/constants';
import configuration from 'src/config/configuration';
import { config as envConfig } from 'dotenv';
import path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

envConfig();

const config = configuration();

export const dataSource = new DataSource({
  type: config.database.type as any,
  host: config.database.host,
  port: config.database.port || 3306,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  migrations: ['src/database/migrations/*.ts'],
  entities: ['src/**/entities/*.ts'],
  synchronize: config.database.sync,
  namingStrategy: new SnakeNamingStrategy(),
});

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const { migrations, entities, ...rest } = dataSource.options;
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
