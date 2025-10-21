import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();
const reportController = new ReportController();

router.use(authenticate);

router.get('/dashboard', reportController.getDashboardStats.bind(reportController));

router.get(
  '/activity-logs',
  authorize(UserRole.ADMIN),
  reportController.getActivityLogs.bind(reportController)
);

export default router;
