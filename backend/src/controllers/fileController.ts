import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import database from '../config/database';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import config from '../config';
import logger from '../utils/logger';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = config.upload.dir;
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (config.upload.allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${ext} not allowed`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

export class FileController {
  async uploadFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const { record_id } = req.body;
      const file = req.file;

      if (!file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      if (!record_id) {
        // Clean up uploaded file
        await fs.unlink(file.path);
        res.status(400).json({ error: 'Record ID is required' });
        return;
      }

      // Verify record exists and user has access
      const [records] = await database.query(
        'SELECT * FROM records WHERE id = ?',
        [record_id]
      );

      if (records.length === 0) {
        await fs.unlink(file.path);
        res.status(404).json({ error: 'Record not found' });
        return;
      }

      // Insert file record
      const result = await database.query(
        `INSERT INTO record_files 
         (record_id, file_name, file_path, file_type, file_size_bytes, uploaded_by_user_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [record_id, file.originalname, file.path, file.mimetype, file.size, user.userId]
      );

      logger.info(`File uploaded for record ${record_id} by user ${user.userId}`);

      res.status(201).json({
        message: 'File uploaded successfully',
        file: {
          id: (result as any).insertId,
          filename: file.originalname,
          size: file.size,
          type: file.mimetype,
        },
      });
    } catch (error) {
      logger.error('File upload error:', error);
      res.status(500).json({ error: 'File upload failed' });
    }
  }

  async getFilesByRecord(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { record_id } = req.params;

      const [files] = await database.query(
        `SELECT f.*, u.full_name as uploaded_by_name
         FROM record_files f
         LEFT JOIN users u ON f.uploaded_by_user_id = u.id
         WHERE f.record_id = ?
         ORDER BY f.uploaded_at DESC`,
        [record_id]
      );

      res.json({ files });
    } catch (error) {
      logger.error('Get files error:', error);
      res.status(500).json({ error: 'Failed to get files' });
    }
  }

  async downloadFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const [files] = await database.query<any[]>(
        'SELECT * FROM record_files WHERE id = ?',
        [id]
      );

      if (files.length === 0) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      const file = files[0];

      // Check if file exists
      try {
        await fs.access(file.file_path);
      } catch {
        res.status(404).json({ error: 'File not found on server' });
        return;
      }

      res.download(file.file_path, file.file_name);
    } catch (error) {
      logger.error('Download file error:', error);
      res.status(500).json({ error: 'File download failed' });
    }
  }

  async deleteFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const { id } = req.params;

      const [files] = await database.query<any[]>(
        'SELECT * FROM record_files WHERE id = ?',
        [id]
      );

      if (files.length === 0) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      const file = files[0];

      // Delete file from filesystem
      try {
        await fs.unlink(file.file_path);
      } catch (error) {
        logger.warn(`Failed to delete file from filesystem: ${file.file_path}`);
      }

      // Delete file record
      await database.query('DELETE FROM record_files WHERE id = ?', [id]);

      logger.info(`File ${id} deleted by user ${user.userId}`);

      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      logger.error('Delete file error:', error);
      res.status(500).json({ error: 'File deletion failed' });
    }
  }
}
