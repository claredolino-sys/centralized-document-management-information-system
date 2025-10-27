import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import database from '../config/database';
import logger from '../utils/logger';

export class ReportController {
  async getDashboardStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;

      let departmentFilter = '';
      let params: any[] = [];

      if (user.departmentId) {
        departmentFilter = 'WHERE department_id = ?';
        params = [user.departmentId];
      }

      const [totalRecords] = await database.query<any[]>(
        `SELECT COUNT(*) as count FROM records ${departmentFilter}`,
        params
      );

      const [recordsByDepartment] = await database.query<any[]>(
        `SELECT d.name, COUNT(r.id) as count
         FROM departments d
         LEFT JOIN records r ON d.id = r.department_id
         ${user.departmentId ? 'WHERE d.id = ?' : ''}
         GROUP BY d.id, d.name`,
        params
      );

      const [recordsByMedium] = await database.query<any[]>(
        `SELECT record_medium, COUNT(*) as count
         FROM records
         ${departmentFilter}
         GROUP BY record_medium`,
        params
      );

      const [pendingRequests] = await database.query<any[]>(
        `SELECT COUNT(*) as count FROM document_requests WHERE status = 'Pending'`
      );

      const [recentActivity] = await database.query<any[]>(
        `SELECT al.*, u.full_name
         FROM activity_logs al
         LEFT JOIN users u ON al.user_id = u.id
         ${user.departmentId ? 'WHERE al.user_id IN (SELECT id FROM users WHERE department_id = ?)' : ''}
         ORDER BY al.action_date_time DESC
         LIMIT 10`,
        params
      );

      res.json({
        totalRecords: totalRecords[0].count,
        recordsByDepartment,
        recordsByMedium,
        pendingRequests: pendingRequests[0].count,
        recentActivity,
      });
    } catch (error) {
      logger.error('Get dashboard stats error:', error);
      res.status(500).json({ error: 'Failed to get dashboard stats' });
    }
  }

  async getActivityLogs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 50 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const [logs] = await database.query<any[]>(
        `SELECT al.*, u.full_name
         FROM activity_logs al
         LEFT JOIN users u ON al.user_id = u.id
         ORDER BY al.action_date_time DESC
         LIMIT ? OFFSET ?`,
        [Number(limit), offset]
      );

      res.json({ logs });
    } catch (error) {
      logger.error('Get activity logs error:', error);
      res.status(500).json({ error: 'Failed to get activity logs' });
    }
  }
}
