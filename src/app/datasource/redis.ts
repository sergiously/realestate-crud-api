// @ts-nocheck
import { createClient } from 'redis';

/**
 * Creates and instantiates a Redis connection
 */
const redis = createClient({
  url: `redis://${process.env.REDIS_HOST as string}:${process.env.REDIS_PORT as string}`,
});

export default redis;
