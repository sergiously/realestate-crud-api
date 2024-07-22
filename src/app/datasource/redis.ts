// @ts-nocheck
import { createClient } from 'redis';

/**
 * Creates and instantiates a Redis connection
 */
const redis = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

export default redis;
