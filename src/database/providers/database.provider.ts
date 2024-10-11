import { DataSource, DataSourceOptions } from 'typeorm';
import { DATA_SOURCE } from 'src/constants';
import configuration from 'src/config/configuration';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const config = configuration();
export const dataSource = new DataSource({
  type: config.database.type as any,
  host: config.database.host,
  port: config.database.port || 3306,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  migrationsRun: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: config.database.sync,
  namingStrategy: new SnakeNamingStrategy(),
});

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      return dataSource.initialize();
    },
  },
];
