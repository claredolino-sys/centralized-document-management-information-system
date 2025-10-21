import { Router } from 'express';
import { body, query } from 'express-validator';
import { RecordController } from '../controllers/recordController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { UserRole } from '../types';

const router = Router();
const recordController = new RecordController();

// All record routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create a new record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - record_series_title_description
 *             properties:
 *               record_series_title_description:
 *                 type: string
 *               period_covered:
 *                 type: string
 *               volume:
 *                 type: string
 *               record_medium:
 *                 type: string
 *               restrictions:
 *                 type: string
 *               location:
 *                 type: string
 *               frequency_of_use:
 *                 type: string
 *               duplication:
 *                 type: string
 *               time_value:
 *                 type: string
 *                 enum: [T, P]
 *               utility_value:
 *                 type: string
 *               retention_period_active:
 *                 type: string
 *               retention_period_storage:
 *                 type: string
 *               retention_period_total:
 *                 type: string
 *               disposition_provision:
 *                 type: string
 *               date_of_record:
 *                 type: string
 *                 format: date
 *               calculated_disposal_date:
 *                 type: string
 *                 format: date
 *               department_id:
 *                 type: number
 *     responses:
 *       201:
 *         description: Record created successfully
 */
router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.CUSTODIAN),
  [
    body('record_series_title_description')
      .notEmpty()
      .withMessage('Record series title is required'),
    validateRequest,
  ],
  recordController.createRecord.bind(recordController)
);

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get all records with pagination
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: department_id
 *         schema:
 *           type: integer
 *         description: Filter by department
 *     responses:
 *       200:
 *         description: Records retrieved successfully
 */
router.get('/', recordController.getRecords.bind(recordController));

/**
 * @swagger
 * /records/disposal-reminders:
 *   get:
 *     summary: Get records due for disposal
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: Days ahead to check
 *     responses:
 *       200:
 *         description: Disposal reminders retrieved successfully
 */
router.get(
  '/disposal-reminders',
  recordController.getDisposalReminders.bind(recordController)
);

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Get a record by ID
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Record retrieved successfully
 *       404:
 *         description: Record not found
 */
router.get('/:id', recordController.getRecordById.bind(recordController));

/**
 * @swagger
 * /records/{id}:
 *   put:
 *     summary: Update a record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       404:
 *         description: Record not found
 */
router.put(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.CUSTODIAN),
  [
    body('record_series_title_description')
      .notEmpty()
      .withMessage('Record series title is required'),
    validateRequest,
  ],
  recordController.updateRecord.bind(recordController)
);

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Delete a record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       403:
 *         description: Only administrators can delete records
 *       404:
 *         description: Record not found
 */
router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  recordController.deleteRecord.bind(recordController)
);

export default router;
