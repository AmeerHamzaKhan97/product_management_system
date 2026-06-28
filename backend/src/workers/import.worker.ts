import { Worker, Job } from 'bullmq';
import path from 'path';
import { QueryTypes } from 'sequelize';
import { env } from '../config/env';
import { sequelize } from '../config/database';
import { importJobRepository } from '../repositories/import-job.repository';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { IMPORT_BATCH_SIZE } from '../constants';
import { parseCsvFile, writeErrorCsv, ErrorRow } from '../utils/csv.util';

interface ImportJobPayload {
  importJobId: string;
  filePath: string;
}

const EXPECTED_HEADERS = ['Product Name', 'Category', 'Price', 'Image URL'];

const URL_REGEX = /^https?:\/\/.+/i;
const PRODUCT_NAME_REGEX = /^[a-zA-Z0-9 \-_]+$/;

function isValidUrl(value: string): boolean {
  if (!URL_REGEX.test(value)) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function headersMatch(actual: string[]): boolean {
  if (actual.length < EXPECTED_HEADERS.length) return false;
  return EXPECTED_HEADERS.every((h, i) => actual[i]?.trim() === h);
}

async function processImportJob(job: Job<ImportJobPayload>): Promise<void> {
  const { importJobId, filePath } = job.data;

  // Step 1 — mark processing
  const importJob = await importJobRepository.findById(importJobId);
  if (!importJob) {
    throw new Error(`ImportJob not found: ${importJobId}`);
  }

  await importJobRepository.updateStatus(importJob.id, 'processing', {
    startedAt: new Date(),
  });

  try {
    // Step 2 — parse CSV
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);

    const { headers, rows } = await parseCsvFile(absolutePath);

    // Step 3 — validate headers
    if (!headersMatch(headers)) {
      const errorMessage = `Invalid CSV headers. Expected: ${EXPECTED_HEADERS.join(', ')}. Got: ${headers.join(', ')}`;
      const errorRows: ErrorRow[] = [
        {
          rowNumber: 1,
          productName: '',
          category: '',
          price: '',
          imageUrl: '',
          productNameError: errorMessage,
          categoryError: '',
          priceError: '',
          imageUrlError: '',
        },
      ];
      const errorCsvPath = await writeErrorCsv(errorRows, importJob.jobId);
      await importJobRepository.updateStatus(importJob.id, 'failed', {
        totalRows: 0,
        failedRows: 1,
        errorCsvPath,
        completedAt: new Date(),
      });
      return;
    }

    const totalRows = rows.length;
    await importJobRepository.updateStatus(importJob.id, 'processing', { totalRows });

    // Step 4 — pre-fetch categories into a Map for O(1) case-insensitive lookup
    const allCategories = await Category.findAll({ attributes: ['id', 'name'] });
    const categoryMap = new Map<string, string>();
    for (const cat of allCategories) {
      categoryMap.set(cat.name.toLowerCase(), cat.id);
    }

    // Step 4 — validate every row
    const validRows: { name: string; categoryId: string; price: number; imageUrl: string }[] = [];
    const errorRows: ErrorRow[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // 1-based, row 1 is headers

      const rawName = row['Product Name'] ?? '';
      const rawCategory = row['Category'] ?? '';
      const rawPrice = row['Price'] ?? '';
      const rawImageUrl = row['Image URL'] ?? '';

      const trimmedName = rawName.trim();
      const trimmedCategory = rawCategory.trim();
      const trimmedPrice = rawPrice.trim();
      const trimmedImageUrl = rawImageUrl.trim();

      let productNameError = '';
      let categoryError = '';
      let priceError = '';
      let imageUrlError = '';

      // Validate Product Name
      if (!trimmedName) {
        productNameError = 'Product Name is required.';
      } else if (trimmedName.length > 255) {
        productNameError = 'Product Name must not exceed 255 characters.';
      } else if (!PRODUCT_NAME_REGEX.test(trimmedName)) {
        productNameError =
          'Product Name may only contain letters, numbers, spaces, hyphens, and underscores.';
      }

      // Validate Category
      let resolvedCategoryId: string | undefined;
      if (!trimmedCategory) {
        categoryError = 'Category is required.';
      } else {
        resolvedCategoryId = categoryMap.get(trimmedCategory.toLowerCase());
        if (!resolvedCategoryId) {
          categoryError = `Category "${trimmedCategory}" does not exist.`;
        }
      }

      // Validate Price
      let parsedPrice = NaN;
      if (!trimmedPrice) {
        priceError = 'Price is required.';
      } else {
        parsedPrice = parseFloat(trimmedPrice);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
          priceError = 'Price must be a valid number greater than 0.';
        }
      }

      // Validate Image URL
      if (!trimmedImageUrl) {
        imageUrlError = 'Image URL is required.';
      } else if (trimmedImageUrl.length > 500) {
        imageUrlError = 'Image URL must not exceed 500 characters.';
      } else if (!isValidUrl(trimmedImageUrl)) {
        imageUrlError = 'Image URL must be a valid URL.';
      }

      const hasError = productNameError || categoryError || priceError || imageUrlError;

      if (hasError) {
        errorRows.push({
          rowNumber,
          productName: rawName,
          category: rawCategory,
          price: rawPrice,
          imageUrl: rawImageUrl,
          productNameError,
          categoryError,
          priceError,
          imageUrlError,
        });
      } else {
        validRows.push({
          name: trimmedName,
          categoryId: resolvedCategoryId!,
          price: parsedPrice,
          imageUrl: trimmedImageUrl,
        });
      }
    }

    // Step 5 — if any errors, write error CSV and fail (do not insert anything)
    if (errorRows.length > 0) {
      const errorCsvPath = await writeErrorCsv(errorRows, importJob.jobId);
      await importJobRepository.updateStatus(importJob.id, 'failed', {
        totalRows,
        processedRows: totalRows,
        failedRows: errorRows.length,
        successfulRows: 0,
        errorCsvPath,
        completedAt: new Date(),
      });
      return;
    }

    // Step 6 — all rows valid: insert in batches within a single transaction
    const transaction = await sequelize.transaction();
    try {
      // bulkCreate does not fire beforeCreate hooks, so uniqueId must be assigned here.
      // Query the last sequence number once (inside the transaction) to avoid race conditions.
      type UniqueIdRow = { uniqueId: string };
      const [lastProduct] = await sequelize.query<UniqueIdRow>(
        `SELECT "uniqueId" FROM "products" ORDER BY "uniqueId" DESC LIMIT 1`,
        { type: QueryTypes.SELECT, transaction },
      );
      const lastNum = lastProduct ? parseInt(lastProduct.uniqueId.split('-')[1], 10) : 0;
      const rowsWithIds = validRows.map((row, i) => ({
        ...row,
        uniqueId: `PRD-${String(lastNum + i + 1).padStart(4, '0')}`,
      }));

      for (let offset = 0; offset < rowsWithIds.length; offset += IMPORT_BATCH_SIZE) {
        const batch = rowsWithIds.slice(offset, offset + IMPORT_BATCH_SIZE);
        await Product.bulkCreate(batch, { transaction });
      }
      await transaction.commit();
    } catch (insertError) {
      await transaction.rollback();
      await importJobRepository.updateStatus(importJob.id, 'failed', {
        totalRows,
        processedRows: 0,
        failedRows: totalRows,
        successfulRows: 0,
        completedAt: new Date(),
      });
      throw insertError;
    }

    // Step 7 — mark completed
    await importJobRepository.updateStatus(importJob.id, 'completed', {
      totalRows,
      processedRows: totalRows,
      successfulRows: validRows.length,
      failedRows: 0,
      completedAt: new Date(),
    });
  } catch (error) {
    // Catch-all: ensure job is always marked failed on unexpected errors
    await importJobRepository
      .updateStatus(importJob.id, 'failed', { completedAt: new Date() })
      .catch(() => {});
    throw error;
  }
}

export function startImportWorker(): Worker<ImportJobPayload> {
  const worker = new Worker<ImportJobPayload>('product-import', processImportJob, {
    connection: {
      host: env.redis.host,
      port: env.redis.port,
      password: env.redis.password,
      maxRetriesPerRequest: null,
    },
    concurrency: 1,
  });

  worker.on('completed', (job) => {
    console.log(`[ImportWorker] Job ${job.id} completed.`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[ImportWorker] Job ${job?.id} failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error('[ImportWorker] Worker error:', err.message);
  });

  console.log('[ImportWorker] Started — listening on product-import queue.');
  return worker;
}
