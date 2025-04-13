import { Injectable, ForbiddenException } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class AuthThrottleGuard extends ThrottlerGuard {
  protected throwThrottlingException(): Promise<void> {
    throw new ForbiddenException('Too many requests, please try again later.');
  }
}
