import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class CustomCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async trackBy(context: ExecutionContext): Promise<string | undefined> {
    const request = context.switchToHttp().getRequest();
    if (request.method !== 'GET') return undefined;

    // Customize cache key generation logic here if needed
    const url = request.url;
    return `cache:${url}`;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async (response) => {
        const key = await this.trackBy(context);
        if (key && response !== null && response !== undefined) {
          // Only cache non-null and non-undefined responses
          await this.cacheManager.set(key, response);
        }
      }),
    );
  }
}
