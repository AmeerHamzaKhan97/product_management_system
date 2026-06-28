import { Router } from 'express';
import { importController } from '../controllers/import.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { uploadCsv } from '../middlewares/upload.middleware';

const router = Router();

router.use(authenticate);

router.post('/', uploadCsv.single('file'), importController.uploadCsv);
router.get('/template', importController.downloadTemplate);
router.get('/history', importController.getHistory);
router.get('/status/:jobId', importController.getStatus);
router.get('/error/:jobId', importController.downloadErrorCsv);

export default router;
