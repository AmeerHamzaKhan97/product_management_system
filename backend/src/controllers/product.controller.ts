import path from 'path';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { productService } from '../services/product.service';
import { successResponse } from '../utils/response.util';
import { reportQueue } from '../queues/report.queue';

export const productController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ success: false, message: errors.array()[0].msg });
        return;
      }

      const { page, pageSize, search, sortBy, sortOrder } = req.query as Record<string, string>;

      const result = await productService.getAll({
        page: page ? parseInt(page, 10) : undefined,
        pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
        search,
        sortBy,
        sortOrder,
      });

      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.getById(req.params.id as string);
      successResponse(res, product);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ success: false, message: errors.array()[0].msg });
        return;
      }

      const { name, imageUrl, price, categoryId } = req.body as {
        name: string;
        imageUrl: string;
        price: number;
        categoryId: string;
      };

      const product = await productService.create({ name, imageUrl, price, categoryId });
      successResponse(res, product, 'Product created successfully.', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ success: false, message: errors.array()[0].msg });
        return;
      }

      const { name, imageUrl, price, categoryId } = req.body as {
        name: string;
        imageUrl: string;
        price: number;
        categoryId: string;
      };

      const product = await productService.update(req.params.id as string, { name, imageUrl, price, categoryId });
      successResponse(res, product, 'Product updated successfully.');
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productService.delete(req.params.id as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async generateReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, sortBy, sortOrder } = req.query as Record<string, string>;
      const userId = req.user!.id;

      const job = await reportQueue.add('generate-report', { search, sortBy, sortOrder, userId });

      res.status(202).json({
        success: true,
        message: 'Report generation started.',
        data: { jobId: job.id },
      });
    } catch (err) {
      next(err);
    }
  },

  async getReportStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const jobId = req.params.jobId as string;
      const job = await reportQueue.getJob(jobId);

      if (!job) {
        res.status(404).json({ success: false, message: 'Report job not found.' });
        return;
      }

      const state = await job.getState();
      const mappedStatus =
        state === 'completed' ? 'completed' : state === 'failed' ? 'failed' : 'processing';

      res.status(200).json({
        success: true,
        data: { status: mappedStatus, jobId },
      });
    } catch (err) {
      next(err);
    }
  },

  async downloadReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const jobId = req.params.jobId as string;
      const job = await reportQueue.getJob(jobId);

      if (!job) {
        res.status(404).json({ success: false, message: 'Report job not found.' });
        return;
      }

      const state = await job.getState();
      if (state !== 'completed') {
        res.status(404).json({ success: false, message: 'Report not ready.' });
        return;
      }

      const result = job.returnvalue as { filePath: string } | undefined;
      if (!result?.filePath) {
        res.status(404).json({ success: false, message: 'Report file not found.' });
        return;
      }

      const absolutePath = path.isAbsolute(result.filePath)
        ? result.filePath
        : path.join(process.cwd(), result.filePath);

      res.download(absolutePath, `products-report-${jobId}.csv`);
    } catch (err) {
      next(err);
    }
  },
};
