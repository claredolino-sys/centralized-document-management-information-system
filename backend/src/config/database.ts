import mysql from 'mysql2/promise';
import config from './index';
import logger from '../utils/logger';

class Database {
  private pool: mysql.Pool | null = null;

  async connect(): Promise<void> {
    try {
      this.pool = mysql.createPool({
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        database: config.database.name,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      });

      // Test the connection
      const connection = await this.pool.getConnection();
      logger.info('Database connected successfully');
      connection.release();
    } catch (error) {
      logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  getPool(): mysql.Pool {
    if (!this.pool) {
      throw new Error('Database not initialized. Call connect() first.');
    }
    return this.pool;
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      logger.info('Database connection closed');
    }
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T> {
    const pool = this.getPool();
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  }
}

const database = new Database();

export default database;
