import redis from 'database/redis';
import { CacheService } from 'services';

jest.mock('database/redis');

const mockedRedis = redis as jest.Mocked<typeof redis>;

const mockFetchFunction = jest.fn().mockResolvedValue({ data: 'api' });

describe('CacheService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return cached value', async () => {
    mockedRedis.get.mockResolvedValueOnce('{"data":"cache"}');

    const response = await new CacheService<{ data: string }>().get(
      'my-key',
      mockFetchFunction
    );

    expect(response.data).toBe('cache');
    expect(mockFetchFunction).not.toBeCalled();
  });

  it('should return api response and cache if not already cached', async () => {
    mockedRedis.get.mockResolvedValueOnce(null);

    const response = await new CacheService<{ data: string }>().get(
      'my-key',
      mockFetchFunction
    );

    expect(mockFetchFunction).toBeCalled();
    expect(response.data).toBe('api');
  });

  it('should be possible to cache value with no expiration time', async () => {
    mockedRedis.get.mockResolvedValueOnce(null);

    const response = await new CacheService<{ data: string }>(0).get(
      'my-key',
      mockFetchFunction
    );

    expect(redis.set).toBeCalled();
    expect(response.data).toBe('api');
  });
});
