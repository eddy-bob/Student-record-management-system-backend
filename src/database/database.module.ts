import { Module } from '@nestjs/common';
import { MysqlDatabaseProviderModule } from './providers/database.provider.module';
@Module({
  providers: [MysqlDatabaseProviderModule],
  exports: [MysqlDatabaseProviderModule],
})
export class DatabaseModule {}
