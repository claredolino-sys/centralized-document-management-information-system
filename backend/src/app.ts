import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';
import config from './config';
import database from './config/database';
import swaggerSpec from './config/swagger';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { auditLogger } from './middleware/audit';

// Import routes
import authRoutes from './routes/authRoutes';
import recordRoutes from './routes/recordRoutes';
import fileRoutes from './routes/fileRoutes';
import requestRoutes from './routes/requestRoutes';
import reportRoutes from './routes/reportRoutes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(
      cors({
        origin: config.cors.origin,
        credentials: true,
      })
    );

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
      message: 'Too many requests from this IP',
    });
    this.app.use(limiter);

    // Compression
    this.app.use(compression());

    // Logging
    this.app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Audit logging
    this.app.use(auditLogger);

    // Serve uploaded files
    this.app.use('/uploads', express.static(config.upload.dir));
  }

  private initializeRoutes(): void {
    const apiPrefix = config.apiPrefix;

    // API Routes
    this.app.use(`${apiPrefix}/auth`, authRoutes);
    this.app.use(`${apiPrefix}/records`, recordRoutes);
    this.app.use(`${apiPrefix}/files`, fileRoutes);
    this.app.use(`${apiPrefix}/requests`, requestRoutes);
    this.app.use(`${apiPrefix}/reports`, reportRoutes);

    // Swagger documentation
    this.app.use(
      `${apiPrefix}/docs`,
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
      })
    );

    // Health check endpoint
    this.app.get(`${apiPrefix}/health`, (req: Request, res: Response) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // Root endpoint
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        message: 'CDMIS API',
        version: '1.0.0',
        docs: `${apiPrefix}/docs`,
      });
    });

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await database.connect();

      // Start server
      const port = config.port;
      this.app.listen(port, () => {
        logger.info(`Server running on port ${port}`);
        logger.info(`Environment: ${config.env}`);
        logger.info(`API Documentation: http://localhost:${port}${config.apiPrefix}/docs`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

export default App;
