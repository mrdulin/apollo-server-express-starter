import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PubSub } from 'graphql-subscriptions';
import Redis from 'ioredis';

import { config } from '../../config';

// const options = {
//   host: config.REDIS_HOST,
//   port: config.REDIS_PORT,
//   retryStrategy: (times: number) => {
//     return Math.max(times * 100, 3000);
//   }
// };

// const pubsub = new RedisPubSub({
//   publisher: new Redis(options),
//   subscriber: new Redis(options)
// });

const pubsub = new RedisPubSub({
  connection: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    retryStrategy: (times: number) => {
      return Math.max(times * 100, 3000);
    }
  }
});

// const pubsub: PubSub = new PubSub();

export { pubsub };
