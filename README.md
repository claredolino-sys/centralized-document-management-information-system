# Centralized Document Management Information System (CDMIS)

A comprehensive document management system for Biliran Province State University (BIPSU) with role-based access control, automated disposal management, and complete audit logging.

## Features

- **Role-Based Access Control (RBAC)**
  - Admin: Full system access
  - Departmental Record Custodian: Department-specific record management
  - Staff: View and request documents

- **Document Inventory Management**
  - Excel-style grid interface for records
  - Comprehensive metadata tracking (follows CDMIS Inventory Form)
  - File upload with local and cloud storage support

- **Request Workflow**
  - Document access request system
  - Approval workflow with remarks
  - ID verification for requesters

- **Automated Disposal Engine**
  - Based on GENERAL RECORDS DISPOSITION SCHEDULE
  - Automated calculation of disposal dates
  - Disposal reminders and notifications

- **Audit Logging**
  - Complete activity tracking
  - User action logging
  - Department-level reporting

- **Reports & Analytics**
  - Dashboard with statistics
  - Pie charts for data visualization
  - Activity logs and disposal reminders

- **Security**
  - JWT authentication
  - HTTPS support
  - Rate limiting
  - Password hashing with bcrypt
  - CORS protection

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- MySQL database
- JWT authentication
- Swagger API documentation

### Frontend
- React with TypeScript
- React Router for routing
- TanStack Query for data fetching
- Recharts for data visualization
- Tailwind CSS for styling
- Radix UI components

### DevOps
- Docker & Docker Compose
- GitHub Actions CI/CD
- Nginx reverse proxy

## Prerequisites

- Node.js 20.x or higher
- MySQL 8.0 or higher
- Docker & Docker Compose (for containerized deployment)
- Git

## Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/claredolino-sys/centralized-document-management-information-system.git
   cd centralized-document-management-information-system
   ```

2. **Set up the database**
   ```bash
   mysql -u root -p < cdmis_db.sql
   ```

3. **Backend setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

4. **Frontend setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api/v1/docs

### Docker Deployment

1. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Build and start containers**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Application: http://localhost (or your domain)
   - API Documentation: http://localhost/api/v1/docs

## Configuration

### Backend Environment Variables

```env
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=cdmis_db
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
UPLOAD_DIR=./uploads
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## API Documentation

Interactive API documentation is available at `/api/v1/docs` when the backend server is running.

### Key Endpoints

- **Authentication**
  - POST `/api/v1/auth/login` - User login
  - POST `/api/v1/auth/register` - User registration
  - GET `/api/v1/auth/profile` - Get user profile

- **Records**
  - GET `/api/v1/records` - List all records
  - POST `/api/v1/records` - Create new record
  - GET `/api/v1/records/:id` - Get record by ID
  - PUT `/api/v1/records/:id` - Update record
  - DELETE `/api/v1/records/:id` - Delete record

- **Files**
  - POST `/api/v1/files/upload` - Upload file
  - GET `/api/v1/files/record/:id` - Get files for record
  - GET `/api/v1/files/download/:id` - Download file

- **Requests**
  - POST `/api/v1/requests` - Create document request
  - GET `/api/v1/requests` - List requests
  - PUT `/api/v1/requests/:id` - Process request

- **Reports**
  - GET `/api/v1/reports/dashboard` - Get dashboard statistics
  - GET `/api/v1/reports/activity-logs` - Get activity logs

## Project Structure

```
├── backend/                # Node.js backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── Dockerfile
│   └── package.json
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── CDMIS LOG IN PAGE/     # Existing login components
├── nginx/                 # Nginx configuration
├── .github/workflows/     # CI/CD workflows
├── cdmis_db.sql          # Database schema
├── docker-compose.yml    # Docker compose config
└── README.md
```

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Linting

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

### Building for Production

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## Deployment

### Using Docker Compose

1. Update `.env` with production values
2. Generate SSL certificates and place in `nginx/ssl/`
3. Run: `docker-compose up -d`

## Security Considerations

- Change all default passwords and secrets
- Use HTTPS in production
- Keep dependencies updated
- Regular database backups
- Implement rate limiting
- Monitor logs for suspicious activity

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub or contact the development team.

## Authors

- Biliran Province State University (BIPSU)

## Acknowledgments

- Built following the CDMIS Inventory Form guidelines
- Implements GENERAL RECORDS DISPOSITION SCHEDULE
- Uses existing CDMIS LOGIN PAGE components