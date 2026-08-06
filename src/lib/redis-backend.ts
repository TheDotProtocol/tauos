import { Redis as UpstashRedis } from '@upstash/redis';
import { createClient, type RedisClientType } from 'redis';

type RateLimitBackend = {
  incr(key: string): Promise<number>;
  pExpire(key: string, ms: number): Promise<void>;
  pTTL(key: string): Promise<number>;
};

let backend: RateLimitBackend | null = null;
let backendInit: Promise<RateLimitBackend | null> | null = null;

async function initBackend(): Promise<RateLimitBackend | null> {
  const restUrl = process.env.UPSTASH_REDIS_REST_URL;
  const restToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (restUrl && restToken) {
    const client = new UpstashRedis({ url: restUrl, token: restToken });
    return {
      async incr(key: string) {
        return client.incr(key);
      },
      async pExpire(key: string, ms: number) {
        await client.pexpire(key, ms);
      },
      async pTTL(key: string) {
        return client.pttl(key);
      },
    };
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return null;

  try {
    const client = createClient({ url: redisUrl });
    client.on('error', (err) => console.error('Redis rate-limit error:', err));
    await client.connect();
    const connected = client as RedisClientType;
    return {
      async incr(key: string) {
        return connected.incr(key);
      },
      async pExpire(key: string, ms: number) {
        await connected.pExpire(key, ms);
      },
      async pTTL(key: string) {
        return connected.pTTL(key);
      },
    };
  } catch (err) {
    console.warn('Redis unavailable — using in-memory rate limits:', err);
    return null;
  }
}

async function getBackend(): Promise<RateLimitBackend | null> {
  if (backend) return backend;
  if (!backendInit) {
    backendInit = initBackend().then((b) => {
      backend = b;
      return b;
    });
  }
  return backendInit;
}

export { getBackend as getRedisBackend };
