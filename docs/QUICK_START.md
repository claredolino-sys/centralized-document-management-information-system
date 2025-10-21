# CDMIS Quick Start Guide

Get the Centralized Document Management Information System up and running in 5 minutes!

## Prerequisites

- Docker and Docker Compose installed
- 2GB RAM available
- 5GB disk space

## Installation Steps

### 1. Clone Repository (30 seconds)

```bash
git clone https://github.com/claredolino-sys/centralized-document-management-information-system.git
cd centralized-document-management-information-system
```

### 2. Configure Environment (1 minute)

```bash
# Copy environment file
cp .env.example .env

# Edit .env file (use strong passwords!)
nano .env
```

Minimum required changes in `.env`:
```env
DB_ROOT_PASSWORD=your_strong_password_here
DB_PASSWORD=your_strong_password_here
JWT_SECRET=your_random_64_character_string_here
JWT_REFRESH_SECRET=your_different_random_64_character_string_here
```

Generate secrets quickly:
```bash
# Linux/Mac
openssl rand -base64 64
```

### 3. Create SSL Certificates (1 minute)

For development (self-signed):
```bash
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=PH/ST=Biliran/L=Naval/O=BIPSU/CN=localhost"
```

### 4. Start Services (2 minutes)

```bash
docker-compose up -d
```

Wait for services to start:
```bash
# Check status
docker-compose ps

# Watch logs
docker-compose logs -f
```

### 5. Create Admin User (1 minute)

```bash
# Generate password hash
docker-compose exec backend node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10));"

# Copy the hash output, then:
docker-compose exec mysql mysql -u root -p$DB_ROOT_PASSWORD cdmis_db
```

In MySQL prompt:
```sql
INSERT INTO users (school_id, password_hash, full_name, email, role) 
VALUES ('admin', 'PASTE_HASH_HERE', 'System Admin', 'admin@bipsu.edu.ph', 'Admin');
exit;
```

### 6. Access System

Open your browser:
- **Frontend:** http://localhost
- **API Docs:** http://localhost/api/v1/docs
- **Login:** Use `admin` / `admin123`

## Quick Test

Test the API:
```bash
# Health check
curl http://localhost/api/v1/health

# Login (get token)
curl -X POST http://localhost/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"school_id":"admin","password":"admin123"}'
```

## Common Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Full cleanup (removes data!)
docker-compose down -v

# Check service status
docker-compose ps

# View backend logs only
docker-compose logs -f backend

# View database logs
docker-compose logs -f mysql
```

## Troubleshooting

### Port Already in Use
```bash
# Check what's using port 80
sudo lsof -i :80

# Kill the process or change docker-compose.yml ports
```

### Database Connection Error
```bash
# Wait 30 seconds for MySQL to initialize
docker-compose logs mysql | grep "ready for connections"
```

### Permission Denied
```bash
# Fix permissions
sudo chown -R $USER:$USER .
```

### Cannot Access Frontend
```bash
# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

## Next Steps

1. **Change default password** immediately
2. **Add departments:**
   ```sql
   INSERT INTO departments (name) VALUES ('Your Department');
   ```
3. **Create more users** via API or database
4. **Configure backup** (see docs/DEPLOYMENT.md)
5. **Set up HTTPS** with real certificates

## Additional Resources

- Full documentation: [README.md](../README.md)
- Deployment guide: [docs/DEPLOYMENT.md](DEPLOYMENT.md)
- Technical details: [docs/TECHNICAL_SUMMARY.md](TECHNICAL_SUMMARY.md)
- API documentation: http://localhost/api/v1/docs (when running)

## Support

Issues? Create a GitHub issue:
https://github.com/claredolino-sys/centralized-document-management-information-system/issues

---

**You're all set! 🎉**

The system is now running with:
- ✅ Backend API at port 5000
- ✅ Frontend at port 80
- ✅ MySQL database at port 3306
- ✅ Nginx reverse proxy with SSL
- ✅ Complete API documentation
