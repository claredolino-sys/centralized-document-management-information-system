import { Router } from 'express';
import { body } from 'express-validator';
import { RequestController } from '../controllers/requestController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { UserRole } from '../types';

const router = Router();
const requestController = new RequestController();

router.use(authenticate);

router.post(
  '/',
  [
    body('record_id').notEmpty().withMessage('Record ID is required'),
    body('purpose').notEmpty().withMessage('Purpose is required'),
    body('requester_id_image_path').notEmpty().withMessage('ID image is required'),
    validateRequest,
  ],
  requestController.createRequest.bind(requestController)
);

router.get('/', requestController.getRequests.bind(requestController));

router.put(
  '/:id',
  authorize(UserRole.ADMIN),
  [
    body('status')
      .isIn(['Approved', 'Rejected'])
      .withMessage('Invalid status'),
    validateRequest,
  ],
  requestController.processRequest.bind(requestController)
);

export default router;
