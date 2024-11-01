import { Module } from '@nestjs/common';
import { MysqlDatabaseProviderModule } from './providers/database.provider.module';
@Module({
  imports: [MysqlDatabaseProviderModule],
})
export class DatabaseModule {}
