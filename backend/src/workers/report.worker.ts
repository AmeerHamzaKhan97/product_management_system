import { Worker, Job } from 'bullmq';
import { env } from '../config/env';
import { productRepository } from '../repositories/product.repository';
import { writeReportCsv, ReportProduct } from '../utils/csv.util';

interface ReportJobPayload {
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  userId: string;
}

interface ReportJobResult {
  filePath: string;
}

async function processReportJob(job: Job<ReportJobPayload>): Promise<ReportJobResult> {
  const { search, sortBy, sortOrder } = job.data;

  // Step 2 — query all matching products without pagination
  const products = await productRepository.findAllForReport({ search, sortBy, sortOrder });

  // Step 3 — write CSV and return the file path
  const reportProducts: ReportProduct[] = products.map((p) => ({
    name: p.name,
    imageUrl: p.imageUrl,
    price: p.price,
    createdAt: p.createdAt,
    category: p.category ? { name: p.category.name } : null,
  }));

  const filePath = await writeReportCsv(reportProducts, job.id!);

  return { filePath };
}

export function startReportWorker(): Worker<ReportJobPayload, ReportJobResult> {
  const worker = new Worker<ReportJobPayload, ReportJobResult>('product-report', processReportJob, {
    connection: {
      host: env.redis.host,
      port: env.redis.port,
      password: env.redis.password,
      maxRetriesPerRequest: null,
    },
    concurrency: 2,
  });

  worker.on('completed', (job) => {
    console.log(`[ReportWorker] Job ${job.id} completed.`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[ReportWorker] Job ${job?.id} failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error('[ReportWorker] Worker error:', err.message);
  });

  console.log('[ReportWorker] Started — listening on product-report queue.');
  return worker;
}
