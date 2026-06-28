import { Queue } from 'bullmq';
import { env } from '../config/env';

export const importQueue = new Queue('product-import', {
  connection: {
    host: env.redis.host,
    port: env.redis.port,
    password: env.redis.password,
    maxRetriesPerRequest: null,
  },
});

export default importQueue;
