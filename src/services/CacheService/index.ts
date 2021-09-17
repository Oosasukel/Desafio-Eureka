import redis from 'database/redis';

const ONE_WEEK = 60 * 60 * 24 * 7;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class CacheService<T = any> {
  constructor(private expiresInSeconds: number = ONE_WEEK) {}

  async get(key: string, fetchFunction: () => Promise<T>): Promise<T> {
    const value = await this.getCachedValue(key);
    if (value) return value;

    return fetchFunction().then((result) => this.cacheValue(key, result));
  }

  private async cacheValue(key: string, value: T): Promise<T> {
    if (this.expiresInSeconds > 0) {
      this.cacheWithExpiration(key, value);
    } else {
      this.cacheWithoutExpiration(key, value);
    }

    return value;
  }

  private async getCachedValue(key: string): Promise<T | null> {
    const value = await redis.get(key);

    return value ? JSON.parse(value) : null;
  }

  private async cacheWithExpiration(key: string, value: T): Promise<void> {
    await redis.set(key, JSON.stringify(value), 'EX', this.expiresInSeconds);
  }

  private async cacheWithoutExpiration(key: string, value: T): Promise<void> {
    await redis.set(key, JSON.stringify(value));
  }
}

export default CacheService;
