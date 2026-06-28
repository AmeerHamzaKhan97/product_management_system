import { Router } from 'express';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';
import importRoutes from './import.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
// Mount import routes before product routes so /products/import/... is not matched by /:id in productRoutes
router.use('/products/import', importRoutes);
router.use('/products', productRoutes);

export default router;
