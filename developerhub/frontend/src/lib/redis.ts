/**
 * Redis Client for Session Persistence
 * Provides persistent storage for terminal and IDE session state
 */

import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

/**
 * Get or create Redis client
 */
export async function getRedisClient(): Promise<RedisClientType | null> {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  // Check if Redis is configured
  const redisUrl = process.env.REDIS_URL || process.env.REDIS_HOST;
  if (!redisUrl && !process.env.REDIS_HOST) {
    console.warn('Redis not configured, session persistence disabled');
    return null;
  }

  try {
    const client = createClient({
      url: redisUrl || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
      password: process.env.REDIS_PASSWORD,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('Redis connection failed after 10 retries');
            return false;
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    client.on('error', (err) => {
      console.error('Redis client error:', err);
    });

    await client.connect();
    redisClient = client as RedisClientType;
    console.log('✅ Redis client connected');
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return null;
  }
}

/**
 * Close Redis connection
 */
export async function closeRedisClient(): Promise<void> {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
  }
}

