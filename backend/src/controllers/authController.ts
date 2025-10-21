import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import database from '../config/database';
import config from '../config';
import { User, JWTPayload } from '../types';
import logger from '../utils/logger';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { school_id, password } = req.body;

      // Find user by school_id
      const users = await database.query<User[]>(
        'SELECT * FROM users WHERE school_id = ?',
        [school_id]
      );

      if (!Array.isArray(users) || users.length === 0) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const user = users[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Generate JWT token
      const payload: JWTPayload = {
        userId: user.id,
        schoolId: user.school_id,
        role: user.role,
        departmentId: user.department_id,
      };

      const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      } as jwt.SignOptions);

      const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
      } as jwt.SignOptions);

      logger.info(`User logged in: ${user.school_id}`);

      res.json({
        token,
        refreshToken,
        user: {
          id: user.id,
          school_id: user.school_id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          department_id: user.department_id,
          profile_picture_url: user.profile_picture_url,
        },
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const {
        school_id,
        password,
        full_name,
        email,
        role,
        department_id,
      } = req.body;

      // Check if user already exists
      const existingUsers = await database.query<User[]>(
        'SELECT id FROM users WHERE school_id = ? OR email = ?',
        [school_id, email]
      );

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        res.status(400).json({ error: 'User already exists' });
        return;
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Insert new user
      await database.query(
        `INSERT INTO users (school_id, password_hash, full_name, email, role, department_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [school_id, password_hash, full_name, email, role, department_id]
      );

      logger.info(`New user registered: ${school_id}`);

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ error: 'Refresh token required' });
        return;
      }

      const decoded = jwt.verify(
        refreshToken,
        config.jwt.refreshSecret
      ) as JWTPayload;

      // Generate new tokens
      const payload: JWTPayload = {
        userId: decoded.userId,
        schoolId: decoded.schoolId,
        role: decoded.role,
        departmentId: decoded.departmentId,
      };

      const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      } as jwt.SignOptions);

      const newRefreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
      } as jwt.SignOptions);

      res.json({ token, refreshToken: newRefreshToken });
    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;

      const users = await database.query<User[]>(
        `SELECT u.*, d.name as department_name 
         FROM users u 
         LEFT JOIN departments d ON u.department_id = d.id 
         WHERE u.id = ?`,
        [userId]
      );

      if (!Array.isArray(users) || users.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const user = users[0];

      res.json({
        id: user.id,
        school_id: user.school_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        department_id: user.department_id,
        department_name: (user as any).department_name,
        profile_picture_url: user.profile_picture_url,
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }
}
