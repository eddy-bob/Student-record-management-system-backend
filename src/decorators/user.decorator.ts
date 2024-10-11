import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Operator } from '../app/operator/entities/operator.entity';

export const CurrentUser = createParamDecorator((context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  return req.user as Operator;
});
