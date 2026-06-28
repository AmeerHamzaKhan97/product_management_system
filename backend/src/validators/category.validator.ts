import { body } from 'express-validator';

export const categoryValidator = [
  body('name')
    .notEmpty().withMessage('Category name is required.')
    .isString().withMessage('Category name must be a string.')
    .isLength({ max: 100 }).withMessage('Category name must not exceed 100 characters.')
    .trim(),
];
