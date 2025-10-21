# CDMIS Deployment Guide

## Prerequisites

- Docker 24.0+ and Docker Compose 2.0+
- MySQL 8.0+ (if not using Docker)
- Node.js 20+ (for local development)
- SSL certificates (for production HTTPS)
- 2GB RAM minimum, 4GB recommended
- 10GB disk space minimum

## Quick Start with Docker

### 1. Clone and Configure

```bash
git clone https://github.com/claredolino-sys/centralized-document-management-information-system.git
cd centralized-document-management-information-system

# Copy and configure environment variables
cp .env.example .env
nano .env  # Edit with your values
```

### 2. Configure Environment Variables

Edit `.env` file:

```env
# Database
DB_ROOT_PASSWORD=your_strong_root_password
DB_NAME=cdmis_db
DB_USER=cdmis_user
DB_PASSWORD=your_strong_password

# JWT Secrets (generate with: openssl rand -base64 64)
JWT_SECRET=your_very_long_jwt_secret
JWT_REFRESH_SECRET=your_very_long_refresh_secret

# CORS
CORS_ORIGIN=https://yourdomain.com
```

### 3. Generate SSL Certificates

For production, obtain certificates from Let's Encrypt:

```bash
# Install certbot
sudo apt-get install certbot

# Generate certificates
sudo certbot certonly --standalone -d yourdomain.com

# Copy to nginx/ssl directory
mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
```

For development, use self-signed certificates:

```bash
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem
```

### 4. Start Services

```bash
docker-compose up -d
```

### 5. Verify Deployment

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Test API
curl http://localhost/api/v1/health
```

### 6. Create First Admin User

Connect to MySQL and create an admin user:

```bash
docker-compose exec mysql mysql -u root -p cdmis_db
```

```sql
-- Create admin user (hash password with bcrypt)
INSERT INTO users (school_id, password_hash, full_name, email, role) 
VALUES (
  'admin', 
  '$2a$10$your_bcrypt_hashed_password_here',
  'System Administrator', 
  'admin@bipsu.edu.ph', 
  'Admin'
);

-- Create sample departments
INSERT INTO departments (name) VALUES ('Office of the President');
INSERT INTO departments (name) VALUES ('Records Management');
INSERT INTO departments (name) VALUES ('IT Department');
```

To generate a password hash:

```bash
# Using Node.js
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your_password', 10));"
```

## Production Deployment

### DNS Configuration

Point your domain to the server:

```
A record: yourdomain.com -> YOUR_SERVER_IP
```

### Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Nginx Configuration

Update `nginx/nginx.conf` with your domain name.

### Database Backup

Set up automated backups:

```bash
# Create backup script
cat > /usr/local/bin/backup-cdmis.sh << 'EOF'
#!/bin/bash
BACKUP_DIR=/var/backups/cdmis
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

docker-compose exec -T mysql mysqldump -u root -p$DB_ROOT_PASSWORD cdmis_db > $BACKUP_DIR/cdmis_$DATE.sql
gzip $BACKUP_DIR/cdmis_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
EOF

chmod +x /usr/local/bin/backup-cdmis.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-cdmis.sh
```

### Monitoring

```bash
# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Monitor resources
docker stats
```

### Updates and Maintenance

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Database migrations (if any)
docker-compose exec mysql mysql -u root -p cdmis_db < migrations/001_add_new_fields.sql
```

## Local Development Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with local MySQL connection
npm run dev
```

Backend will run on http://localhost:5000

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api/v1
npm run dev
```

Frontend will run on http://localhost:5173

### Database Setup

```bash
mysql -u root -p < cdmis_db.sql
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs [service-name]

# Check if ports are available
sudo netstat -tulpn | grep -E ':(80|443|3306|5000)'
```

### Database connection failed

```bash
# Check MySQL is running
docker-compose ps mysql

# Test connection
docker-compose exec mysql mysql -u cdmis_user -p cdmis_db
```

### Cannot access API

```bash
# Check backend logs
docker-compose logs backend

# Test backend directly
curl http://localhost:5000/api/v1/health
```

### Frontend shows blank page

```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

## Performance Tuning

### MySQL Optimization

Edit `docker-compose.yml`:

```yaml
mysql:
  environment:
    MYSQL_INNODB_BUFFER_POOL_SIZE: 1G
    MYSQL_MAX_CONNECTIONS: 200
```

### Node.js Backend

```yaml
backend:
  environment:
    NODE_ENV: production
    NODE_OPTIONS: --max-old-space-size=2048
```

### Nginx Caching

Add to `nginx/nginx.conf`:

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m;
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Generate strong JWT secrets
- [ ] Install SSL certificates
- [ ] Enable firewall
- [ ] Set up regular backups
- [ ] Configure log rotation
- [ ] Enable fail2ban for SSH
- [ ] Update Docker images regularly
- [ ] Monitor security advisories
- [ ] Restrict database access
- [ ] Use environment variables (never commit secrets)
- [ ] Enable audit logging
- [ ] Set up intrusion detection

## Support

For issues, contact:
- Email: support@bipsu.edu.ph
- GitHub Issues: https://github.com/claredolino-sys/centralized-document-management-information-system/issues
