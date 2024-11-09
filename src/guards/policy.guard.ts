import { Injectable } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from 'src/permission/operator.permission';
import { CHECK_POLICIES_KEY } from 'src/constants';
import { PolicyHandler } from 'src/permission/type';
import { ExecutionContext } from '@nestjs/common';
import { AppAbility } from 'src/permission/operator.permission';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
