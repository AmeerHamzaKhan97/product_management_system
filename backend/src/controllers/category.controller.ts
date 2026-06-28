import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { categoryService } from '../services/category.service';
import { successResponse } from '../utils/response.util';

export const categoryController = {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.getAll();
      successResponse(res, { items: categories });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.getById(req.params.id as string);
      successResponse(res, category);
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
      const category = await categoryService.create(req.body.name as string);
      successResponse(res, category, 'Category created successfully.', 201);
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
      const category = await categoryService.update(req.params.id as string, req.body.name as string);
      successResponse(res, category, 'Category updated successfully.');
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await categoryService.delete(req.params.id as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
