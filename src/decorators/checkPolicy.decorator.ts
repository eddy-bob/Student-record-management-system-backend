import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from 'src/permission/type';
import { CHECK_POLICIES_KEY } from 'src/constants';

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
