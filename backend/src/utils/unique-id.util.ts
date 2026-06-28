import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/database';

type Row = { uniqueId: string };

async function nextSequence(table: string, prefix: string): Promise<string> {
  const rows = await sequelize.query<Row>(
    `SELECT "uniqueId" FROM "${table}" ORDER BY "uniqueId" DESC LIMIT 1`,
    { type: QueryTypes.SELECT }
  );
  const last = rows[0];
  const nextNum = last ? parseInt(last.uniqueId.split('-')[1], 10) + 1 : 1;
  return `${prefix}-${String(nextNum).padStart(4, '0')}`;
}

export function generateCategoryId(): Promise<string> {
  return nextSequence('categories', 'CAT');
}

export function generateProductId(): Promise<string> {
  return nextSequence('products', 'PRD');
}
