import { parse } from 'csv-parse';
import { createReadStream, createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

export interface ReportProduct {
  name: string;
  imageUrl: string;
  price: number;
  createdAt: Date;
  category?: { name: string } | null;
}

export interface ParsedCsvResult {
  headers: string[];
  rows: Record<string, string>[];
}

export interface ErrorRow {
  rowNumber: number;
  productName: string;
  category: string;
  price: string;
  imageUrl: string;
  productNameError: string;
  categoryError: string;
  priceError: string;
  imageUrlError: string;
}

export function parseCsvFile(filePath: string): Promise<ParsedCsvResult> {
  return new Promise((resolve, reject) => {
    const rows: Record<string, string>[] = [];
    let headers: string[] = [];
    let isFirstRow = true;

    const parser = parse({ trim: true, relax_column_count: true });

    parser.on('readable', () => {
      let row: string[];
      while ((row = parser.read()) !== null) {
        if (isFirstRow) {
          headers = row;
          isFirstRow = false;
        } else {
          const obj: Record<string, string> = {};
          headers.forEach((header, i) => {
            obj[header] = row[i] ?? '';
          });
          rows.push(obj);
        }
      }
    });

    parser.on('error', reject);
    parser.on('end', () => resolve({ headers, rows }));

    createReadStream(filePath).pipe(parser);
  });
}

export async function writeErrorCsv(errorRows: ErrorRow[], jobId: string): Promise<string> {
  const errorsDir = path.join(process.cwd(), 'uploads', 'errors');
  await mkdir(errorsDir, { recursive: true });

  const timestamp = Date.now();
  const filename = `error-${jobId}-${timestamp}.csv`;
  const filePath = path.join(errorsDir, filename);

  const headerLine = ['Row Number', 'Product Name', 'Category', 'Price', 'Image URL']
    .map(escapeCsvField)
    .join(',');

  return new Promise((resolve, reject) => {
    const ws = createWriteStream(filePath);

    ws.write(headerLine + '\n');

    for (const row of errorRows) {
      const line = [
        row.rowNumber,
        embedError(row.productName, row.productNameError),
        embedError(row.category, row.categoryError),
        embedError(row.price, row.priceError),
        embedError(row.imageUrl, row.imageUrlError),
      ].join(',');
      ws.write(line + '\n');
    }

    ws.end();
    ws.on('finish', () => resolve(filePath));
    ws.on('error', reject);
  });
}

// Failing cell: show only the error message. Valid cell: empty.
function embedError(_value: string, error: string): string {
  return error ? escapeCsvField(error) : '';
}

export async function writeReportCsv(products: ReportProduct[], jobId: string): Promise<string> {
  const reportsDir = path.join(process.cwd(), 'uploads', 'reports');
  await mkdir(reportsDir, { recursive: true });

  const timestamp = Date.now();
  const filename = `products-report-${jobId}-${timestamp}.csv`;
  const filePath = path.join(reportsDir, filename);

  const headerLine = ['Product Name', 'Category', 'Price', 'Image URL', 'Created Date']
    .map(escapeCsvField)
    .join(',');

  return new Promise((resolve, reject) => {
    const ws = createWriteStream(filePath);

    ws.write(headerLine + '\n');

    for (const product of products) {
      const line = [
        escapeCsvField(product.name),
        escapeCsvField(product.category?.name ?? ''),
        escapeCsvField(String(product.price)),
        escapeCsvField(product.imageUrl),
        escapeCsvField(product.createdAt.toISOString()),
      ].join(',');
      ws.write(line + '\n');
    }

    ws.end();
    ws.on('finish', () => resolve(filePath));
    ws.on('error', reject);
  });
}

function escapeCsvField(value: string | number): string {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
