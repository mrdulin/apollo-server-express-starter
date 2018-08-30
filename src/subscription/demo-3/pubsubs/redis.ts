import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

import { config } from '../../../config';

let pubsub: RedisPubSub;
const options = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  retryStrategy: (times: number) => {
    return Math.max(times * 100, 3000);
  }
};

if (process.env.NODE_ENV === 'production') {
  pubsub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options)
  });
} else {
  pubsub = new RedisPubSub({
    connection: options
  });
}

export { pubsub };
