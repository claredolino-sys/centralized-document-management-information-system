import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - school_id
 *               - password
 *             properties:
 *               school_id:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  [
    body('school_id').notEmpty().withMessage('School ID is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest,
  ],
  authController.login.bind(authController)
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - school_id
 *               - password
 *               - full_name
 *               - email
 *               - role
 *             properties:
 *               school_id:
 *                 type: string
 *               password:
 *                 type: string
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Admin, Departmental Record Custodian, Staff]
 *               department_id:
 *                 type: number
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
router.post(
  '/register',
  [
    body('school_id').notEmpty().withMessage('School ID is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role')
      .isIn(['Admin', 'Departmental Record Custodian', 'Staff'])
      .withMessage('Invalid role'),
    validateRequest,
  ],
  authController.register.bind(authController)
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post(
  '/refresh',
  [body('refreshToken').notEmpty().withMessage('Refresh token is required'), validateRequest],
  authController.refreshToken.bind(authController)
);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Not authenticated
 */
router.get('/profile', authenticate, authController.getProfile.bind(authController));

export default router;
