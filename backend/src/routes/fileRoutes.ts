import { Router } from 'express';
import { FileController, upload } from '../controllers/fileController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();
const fileController = new FileController();

router.use(authenticate);

router.post(
  '/upload',
  authorize(UserRole.ADMIN, UserRole.CUSTODIAN),
  upload.single('file'),
  fileController.uploadFile.bind(fileController)
);

router.get('/record/:record_id', fileController.getFilesByRecord.bind(fileController));

router.get('/download/:id', fileController.downloadFile.bind(fileController));

router.delete(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.CUSTODIAN),
  fileController.deleteFile.bind(fileController)
);

export default router;
