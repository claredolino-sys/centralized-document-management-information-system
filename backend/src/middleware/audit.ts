import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import database from '../config/database';
import logger from '../utils/logger';

export const auditLogger = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const originalSend = res.send;

  res.send = function (data: any): Response {
    // Only log successful operations
    if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
      const operation = getOperationType(req.method, req.path);
      
      if (operation) {
        logActivity(req, operation).catch((error) => {
          logger.error('Failed to log activity:', error);
        });
      }
    }

    return originalSend.call(this, data);
  };

  next();
};

function getOperationType(method: string, path: string): string | null {
  if (path.includes('/auth/login')) return 'Login';
  if (path.includes('/auth/logout')) return 'Logout';
  if (method === 'POST' && path.includes('/records')) return 'Create Record';
  if (method === 'PUT' && path.includes('/records')) return 'Update Record';
  if (method === 'DELETE' && path.includes('/records')) return 'Delete Record';
  if (method === 'GET' && path.includes('/records/')) return 'View Record';
  if (method === 'POST' && path.includes('/files')) return 'Upload File';
  if (method === 'POST' && path.includes('/requests')) return 'Create Request';
  if (method === 'PUT' && path.includes('/requests')) return 'Process Request';
  
  return null;
}

async function logActivity(req: AuthRequest, operation: string): Promise<void> {
  if (!req.user) return;

  try {
    // Get user's department name
    const [users] = await database.query<any[]>(
      'SELECT d.name FROM users u LEFT JOIN departments d ON u.department_id = d.id WHERE u.id = ?',
      [req.user.userId]
    );

    const office = users.length > 0 ? users[0].name || 'Admin Office' : 'Unknown';

    let recordTitle: string | null = null;
    let details: string | null = null;

    // Extract record title from request body if available
    if (req.body?.record_series_title_description) {
      recordTitle = req.body.record_series_title_description;
    }

    // Add IP address to details
    const ip = req.ip || req.connection.remoteAddress;
    details = `IP: ${ip}`;

    await database.query(
      `INSERT INTO activity_logs 
       (user_id, office, operation, record_series_title_description, details) 
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.userId, office, operation, recordTitle, details]
    );
  } catch (error) {
    logger.error('Error logging activity:', error);
  }
}
