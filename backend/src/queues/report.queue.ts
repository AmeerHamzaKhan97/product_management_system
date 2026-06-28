import { Queue } from 'bullmq';
import { env } from '../config/env';

export const reportQueue = new Queue('product-report', {
  connection: {
    host: env.redis.host,
    port: env.redis.port,
    password: env.redis.password,
    maxRetriesPerRequest: null,
  },
});

export default reportQueue;
