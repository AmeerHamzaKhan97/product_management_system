import path from 'path';
import multer from 'multer';
import { BadRequestError } from '../types';
import { env } from '../config/env';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/imports'));
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `import-${timestamp}-${file.originalname}`);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const ext = path.extname(file.originalname).toLowerCase();
  const validMimes = ['text/csv', 'application/csv', 'application/vnd.ms-excel', 'text/plain'];

  if (ext === '.csv' && validMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only .csv files are allowed.'));
  }
};

export const uploadCsv = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.maxFileSizeMb * 1024 * 1024,
  },
});
