import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authenticate } from '../middlewares/auth.middleware';
import {
  createProductValidator,
  productQueryValidator,
  updateProductValidator,
} from '../validators/product.validator';

const router = Router();

router.use(authenticate);

router.get('/', productQueryValidator, productController.getAll);

// Report routes must appear before /:id to avoid route capture
router.get('/report', productController.generateReport);
router.get('/report/:jobId/status', productController.getReportStatus);
router.get('/report/:jobId/download', productController.downloadReport);

router.get('/:id', productController.getById);
router.post('/', createProductValidator, productController.create);
router.put('/:id', updateProductValidator, productController.update);
router.delete('/:id', productController.delete);

export default router;
