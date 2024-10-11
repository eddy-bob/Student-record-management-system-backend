import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from 'src/permission/operator.permission';
@Module({})
export class CaslModule {
  providers: [CaslAbilityFactory];
  exports: [CaslAbilityFactory];
}
