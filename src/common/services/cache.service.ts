import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectionToken } from '@nestjs/common/interfaces';

interface ICacheStore {
  keys(): Promise<string[]>;
  get<T>(key: string): Promise<T | undefined>;
  set(key: string, value: unknown, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
}

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER as InjectionToken) private cacheManager: ICacheStore,
  ) {}

  async clearCache(prefix: string): Promise<void> {
    const keys = await this.cacheManager.keys();
    const keysToDelete = keys.filter((key: string) => key.startsWith(prefix));
    await Promise.all(
      keysToDelete.map((key: string) => this.cacheManager.del(key)),
    );
  }

  async clearCacheByPattern(pattern: string): Promise<void> {
    const keys = await this.cacheManager.keys();
    const regex = new RegExp(pattern);
    const keysToDelete = keys.filter((key: string) => regex.test(key));
    await Promise.all(
      keysToDelete.map((key: string) => this.cacheManager.del(key)),
    );
  }
}
