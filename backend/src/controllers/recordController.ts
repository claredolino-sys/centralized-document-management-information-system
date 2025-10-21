import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import database from '../config/database';
import { Record, UserRole } from '../types';
import logger from '../utils/logger';

export class RecordController {
  async createRecord(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const recordData = req.body;

      // For custodians and staff, use their department
      const departmentId = 
        user.role === UserRole.ADMIN && recordData.department_id
          ? recordData.department_id
          : user.departmentId;

      if (!departmentId) {
        res.status(400).json({ error: 'Department ID is required' });
        return;
      }

      const result = await database.query(
        `INSERT INTO records (
          record_series_title_description, period_covered, volume, record_medium,
          restrictions, location, frequency_of_use, duplication, time_value,
          utility_value, retention_period_active, retention_period_storage,
          retention_period_total, disposition_provision, date_of_record,
          calculated_disposal_date, department_id, created_by_user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          recordData.record_series_title_description,
          recordData.period_covered,
          recordData.volume,
          recordData.record_medium,
          recordData.restrictions,
          recordData.location,
          recordData.frequency_of_use,
          recordData.duplication,
          recordData.time_value,
          recordData.utility_value,
          recordData.retention_period_active,
          recordData.retention_period_storage,
          recordData.retention_period_total,
          recordData.disposition_provision,
          recordData.date_of_record,
          recordData.calculated_disposal_date,
          departmentId,
          user.userId,
        ]
      );

      logger.info(`Record created by user ${user.userId}`);

      res.status(201).json({
        message: 'Record created successfully',
        id: (result as any).insertId,
      });
    } catch (error) {
      logger.error('Create record error:', error);
      res.status(500).json({ error: 'Failed to create record' });
    }
  }

  async getRecords(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const { page = 1, limit = 50, search = '', department_id } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      let whereClause = '';
      let params: any[] = [];

      // Role-based filtering
      if (user.role !== UserRole.ADMIN) {
        whereClause = 'WHERE r.department_id = ?';
        params.push(user.departmentId);
      } else if (department_id) {
        whereClause = 'WHERE r.department_id = ?';
        params.push(department_id);
      }

      // Search filtering
      if (search) {
        whereClause += whereClause ? ' AND' : 'WHERE';
        whereClause += ' r.record_series_title_description LIKE ?';
        params.push(`%${search}%`);
      }

      const [records] = await database.query<Record[]>(
        `SELECT r.*, d.name as department_name, u.full_name as created_by_name
         FROM records r
         LEFT JOIN departments d ON r.department_id = d.id
         LEFT JOIN users u ON r.created_by_user_id = u.id
         ${whereClause}
         ORDER BY r.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, Number(limit), offset]
      );

      const [countResult] = await database.query<any[]>(
        `SELECT COUNT(*) as total FROM records r ${whereClause}`,
        params
      );

      res.json({
        records,
        pagination: {
          total: countResult[0].total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(countResult[0].total / Number(limit)),
        },
      });
    } catch (error) {
      logger.error('Get records error:', error);
      res.status(500).json({ error: 'Failed to get records' });
    }
  }

  async getRecordById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const { id } = req.params;

      let whereClause = 'WHERE r.id = ?';
      let params: any[] = [id];

      if (user.role !== UserRole.ADMIN) {
        whereClause += ' AND r.department_id = ?';
        params.push(user.departmentId);
      }

      const [records] = await database.query<Record[]>(
        `SELECT r.*, d.name as department_name, u.full_name as created_by_name
         FROM records r
         LEFT JOIN departments d ON r.department_id = d.id
         LEFT JOIN users u ON r.created_by_user_id = u.id
         ${whereClause}`,
        params
      );

      if (records.length === 0) {
        res.status(404).json({ error: 'Record not found' });
        return;
      }

      // Get associated files
      const [files] = await database.query(
        'SELECT * FROM record_files WHERE record_id = ?',
        [id]
      );

      res.json({
        record: records[0],
        files,
      });
    } catch (error) {
      logger.error('Get record by ID error:', error);
      res.status(500).json({ error: 'Failed to get record' });
    }
  }

  async updateRecord(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const { id } = req.params;
      const recordData = req.body;

      // Check if record exists and user has permission
      let whereClause = 'WHERE id = ?';
      let params: any[] = [id];

      if (user.role !== UserRole.ADMIN) {
        whereClause += ' AND department_id = ?';
        params.push(user.departmentId);
      }

      const [existingRecords] = await database.query<Record[]>(
        `SELECT * FROM records ${whereClause}`,
        params
      );

      if (existingRecords.length === 0) {
        res.status(404).json({ error: 'Record not found or access denied' });
        return;
      }

      await database.query(
        `UPDATE records SET
          record_series_title_description = ?,
          period_covered = ?,
          volume = ?,
          record_medium = ?,
          restrictions = ?,
          location = ?,
          frequency_of_use = ?,
          duplication = ?,
          time_value = ?,
          utility_value = ?,
          retention_period_active = ?,
          retention_period_storage = ?,
          retention_period_total = ?,
          disposition_provision = ?,
          date_of_record = ?,
          calculated_disposal_date = ?
         WHERE id = ?`,
        [
          recordData.record_series_title_description,
          recordData.period_covered,
          recordData.volume,
          recordData.record_medium,
          recordData.restrictions,
          recordData.location,
          recordData.frequency_of_use,
          recordData.duplication,
          recordData.time_value,
          recordData.utility_value,
          recordData.retention_period_active,
          recordData.retention_period_storage,
          recordData.retention_period_total,
          recordData.disposition_provision,
          recordData.date_of_record,
          recordData.calculated_disposal_date,
          id,
        ]
      );

      logger.info(`Record ${id} updated by user ${user.userId}`);

      res.json({ message: 'Record updated successfully' });
    } catch (error) {
      logger.error('Update record error:', error);
      res.status(500).json({ error: 'Failed to update record' });
    }
  }

  async deleteRecord(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const { id } = req.params;

      // Only admins can delete records
      if (user.role !== UserRole.ADMIN) {
        res.status(403).json({ error: 'Only administrators can delete records' });
        return;
      }

      const [existingRecords] = await database.query<Record[]>(
        'SELECT * FROM records WHERE id = ?',
        [id]
      );

      if (existingRecords.length === 0) {
        res.status(404).json({ error: 'Record not found' });
        return;
      }

      await database.query('DELETE FROM records WHERE id = ?', [id]);

      logger.info(`Record ${id} deleted by user ${user.userId}`);

      res.json({ message: 'Record deleted successfully' });
    } catch (error) {
      logger.error('Delete record error:', error);
      res.status(500).json({ error: 'Failed to delete record' });
    }
  }

  async getDisposalReminders(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const { days = 30 } = req.query;

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Number(days));

      let whereClause = 'WHERE r.calculated_disposal_date IS NOT NULL AND r.calculated_disposal_date <= ?';
      let params: any[] = [futureDate.toISOString().split('T')[0]];

      if (user.role !== UserRole.ADMIN) {
        whereClause += ' AND r.department_id = ?';
        params.push(user.departmentId);
      }

      const [records] = await database.query<Record[]>(
        `SELECT r.*, d.name as department_name
         FROM records r
         LEFT JOIN departments d ON r.department_id = d.id
         ${whereClause}
         ORDER BY r.calculated_disposal_date ASC`,
        params
      );

      res.json({ records });
    } catch (error) {
      logger.error('Get disposal reminders error:', error);
      res.status(500).json({ error: 'Failed to get disposal reminders' });
    }
  }
}
