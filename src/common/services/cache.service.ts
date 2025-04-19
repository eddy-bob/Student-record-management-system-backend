import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectionToken } from '@nestjs/common/interfaces';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER as InjectionToken) private cacheManager: Cache,
  ) {}

  async clearCache(prefix: string): Promise<void> {
    const keys = await this.cacheManager.store.keys();
    console.log(keys);
    const keysToDelete = keys.filter((key) => key.startsWith(prefix));
    await Promise.all(keysToDelete.map((key) => this.cacheManager.del(key)));
  }

  async clearCacheByPattern(pattern: string): Promise<void> {
    const keys = await this.cacheManager.store.keys();
    console.log(keys);
    const regex = new RegExp(pattern);
    const keysToDelete = keys.filter((key) => regex.test(key));
    await Promise.all(keysToDelete.map((key) => this.cacheManager.del(key)));
  }
}
