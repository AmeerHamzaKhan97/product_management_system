import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { categoryValidator } from '../validators/category.validator';

const router = Router();

router.use(authenticate);

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', categoryValidator, categoryController.create);
router.put('/:id', categoryValidator, categoryController.update);
router.delete('/:id', categoryController.delete);

export default router;
