import { body, query } from 'express-validator';

export const productQueryValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.').toInt(),
  query('pageSize')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Page size must be between 1 and 100.')
    .toInt(),
  query('search').optional().isString().trim(),
  query('sortBy')
    .optional()
    .isIn(['name', 'price', 'createdAt'])
    .withMessage("Sort field must be one of: name, price, createdAt."),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage("Sort order must be 'asc' or 'desc'."),
];

export const createProductValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required.')
    .isLength({ max: 255 })
    .withMessage('Product name must not exceed 255 characters.'),
  body('categoryId')
    .notEmpty()
    .withMessage('Category is required.')
    .isUUID()
    .withMessage('Category ID must be a valid UUID.'),
  body('price')
    .notEmpty()
    .withMessage('Price is required.')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number.'),
  body('imageUrl')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required.')
    .isURL()
    .withMessage('Image URL must be a valid URL.')
    .isLength({ max: 500 })
    .withMessage('Image URL must not exceed 500 characters.'),
];

export const updateProductValidator = createProductValidator;
