import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import database from '../config/database';
import { RequestStatus, UserRole } from '../types';
import logger from '../utils/logger';

export class RequestController {
  async createRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const { record_id, purpose, requester_id_image_path } = req.body;

      const result = await database.query(
        `INSERT INTO document_requests 
         (record_id, requester_user_id, purpose, requester_id_image_path, status)
         VALUES (?, ?, ?, ?, ?)`,
        [record_id, user.userId, purpose, requester_id_image_path, RequestStatus.PENDING]
      );

      logger.info(`Document request created by user ${user.userId}`);

      res.status(201).json({
        message: 'Request created successfully',
        id: (result as any).insertId,
      });
    } catch (error) {
      logger.error('Create request error:', error);
      res.status(500).json({ error: 'Failed to create request' });
    }
  }

  async getRequests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const { status, page = 1, limit = 50 } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      let whereClause = '';
      let params: any[] = [];

      if (user.role === UserRole.STAFF) {
        whereClause = 'WHERE dr.requester_user_id = ?';
        params.push(user.userId);
      }

      if (status) {
        whereClause += whereClause ? ' AND' : 'WHERE';
        whereClause += ' dr.status = ?';
        params.push(status);
      }

      const [requests] = await database.query(
        `SELECT dr.*, r.record_series_title_description, 
                u1.full_name as requester_name, u2.full_name as approver_name
         FROM document_requests dr
         LEFT JOIN records r ON dr.record_id = r.id
         LEFT JOIN users u1 ON dr.requester_user_id = u1.id
         LEFT JOIN users u2 ON dr.approver_user_id = u2.id
         ${whereClause}
         ORDER BY dr.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, Number(limit), offset]
      );

      res.json({ requests });
    } catch (error) {
      logger.error('Get requests error:', error);
      res.status(500).json({ error: 'Failed to get requests' });
    }
  }

  async processRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const { id } = req.params;
      const { status, remarks } = req.body;

      if (user.role !== UserRole.ADMIN) {
        res.status(403).json({ error: 'Only administrators can process requests' });
        return;
      }

      await database.query(
        `UPDATE document_requests 
         SET status = ?, approver_user_id = ?, remarks = ?
         WHERE id = ?`,
        [status, user.userId, remarks, id]
      );

      logger.info(`Request ${id} processed by user ${user.userId}`);

      res.json({ message: 'Request processed successfully' });
    } catch (error) {
      logger.error('Process request error:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  }
}
