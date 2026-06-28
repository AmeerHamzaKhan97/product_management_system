import path from 'path';
import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import { importService } from '../services/import.service';
import { importJobRepository } from '../repositories/import-job.repository';
import { successResponse } from '../utils/response.util';
import { NotFoundError } from '../types';

export const importController = {
  async uploadCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded.' });
        return;
      }

      const result = await importService.uploadCsv(req.file, req.user!.id);
      successResponse(res, result, 'Import started successfully.', 202);
    } catch (err) {
      next(err);
    }
  },

  async getHistory(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const jobs = await importJobRepository.findAll();
      successResponse(res, { items: jobs });
    } catch (err) {
      next(err);
    }
  },

  async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const job = await importJobRepository.findByJobId(req.params['jobId'] as string);
      if (!job) throw new NotFoundError('Import job not found.');
      successResponse(res, job);
    } catch (err) {
      next(err);
    }
  },

  async downloadErrorCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const job = await importJobRepository.findByJobId(req.params['jobId'] as string);
      if (!job || !job.errorCsvPath) {
        throw new NotFoundError('Error report not found.');
      }

      const filePath = path.resolve(job.errorCsvPath);
      if (!fs.existsSync(filePath)) {
        throw new NotFoundError('Error report file not found.');
      }

      res.download(filePath, path.basename(filePath));
    } catch (err) {
      next(err);
    }
  },

  async downloadTemplate(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filePath = path.resolve(process.cwd(), 'uploads', 'templates', 'sample-products.csv');
      if (!fs.existsSync(filePath)) {
        throw new NotFoundError('Template file not found.');
      }
      res.download(filePath, 'sample-products.csv');
    } catch (err) {
      next(err);
    }
  },
};
