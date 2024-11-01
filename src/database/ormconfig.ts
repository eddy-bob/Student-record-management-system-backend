import configuration from '../config/configuration';
import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { config as envConfig } from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

envConfig();

const config = configuration();

export const AppDataSource = new DataSource({
  type: config.database.type as MysqlConnectionOptions['type'] | 'mysql',
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
