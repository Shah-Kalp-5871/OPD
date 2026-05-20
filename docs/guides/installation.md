# MedFlow OPD System — Installation Guide

## Prerequisites

| Requirement | Minimum Version | Notes |
|---|---|---|
| Docker | 24.x | With Buildx plugin |
| Docker Compose | v2.x | `docker compose` (not `docker-compose`) |
| Node.js | 20 LTS | For local development only |
| PostgreSQL | 16 | Managed by Docker in production |
| Redis | 7 | Managed by Docker in production |
| Nginx | 1.25+ | Managed by Docker in production |
| OS | Ubuntu 22.04+ | Recommended for production |

---

## 1. Clone Repository

```bash
git clone https://github.com/your-org/medflow-opd.git
cd medflow-opd
```

---

## 2. Environment Configuration

### Step 1: Create production environment file

```bash
cp .env.example.enterprise .env.production
```

### Step 2: Fill in all required values

Open `.env.production` in a text editor and replace every `<REPLACE_THIS>` placeholder:

```bash
# Generate a strong JWT secret (minimum 48 characters)
openssl rand -base64 48

# Generate a strong Redis password
openssl rand -base64 32

# Generate a strong PostgreSQL password
openssl rand -base64 32
```

**Required Variables:**

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Full PostgreSQL connection string | `postgresql://medflow:pass@postgres:5432/medflow_db` |
| `POSTGRES_DB` | Database name | `medflow_db` |
| `POSTGRES_USER` | Database user | `medflow` |
| `POSTGRES_PASSWORD` | Database password | (generated above) |
| `JWT_SECRET` | JWT signing key (48+ chars) | (generated above) |
| `CORS_ORIGIN` | Your frontend domain | `https://clinic.example.com` |
| `REDIS_HOST` | Redis hostname (Docker: `redis`) | `redis` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD` | Redis password | (generated above) |

---

## 3. SSL Certificates

Place your SSL certificates in `nginx/ssl/`:

```bash
# Option A: Let's Encrypt (recommended)
certbot certonly --standalone -d your-domain.com
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem   nginx/ssl/

# Option B: Self-signed (development/testing only)
openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/privkey.pem \
  -out nginx/ssl/fullchain.pem -days 365 -nodes \
  -subj "/CN=localhost"
```

**For non-SSL setup** (behind existing load balancer):
- Edit `nginx/conf.d/medflow.conf`
- Remove the HTTP→HTTPS redirect block
- Enable the direct proxy `include` directive

---

## 4. Build and Start

### Production

```bash
# Build and start all services
docker compose -f docker-compose.production.yml --env-file .env.production up -d --build

# Verify all services are running
docker compose -f docker-compose.production.yml ps

# Check logs
docker compose -f docker-compose.production.yml logs -f backend
```

### Development (local)

```bash
# Start only PostgreSQL and Redis via Docker
docker compose -f docker-compose.development.yml up -d postgres redis

# Run backend locally with hot-reload
cd backend
npm install
npm run start:dev

# Run frontend locally
cd ../frontend
npm install
npm run dev
```

---

## 5. Verify Installation

### Check service health

```bash
# Backend health (all checks)
curl http://localhost/api/health

# Liveness probe
curl http://localhost/api/health/live

# Readiness probe
curl http://localhost/api/health/ready
```

### Expected response

```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "redis": { "status": "up" },
    "bullmq": { "status": "up" },
    "memory_heap": { "status": "up" },
    "storage": { "status": "up" }
  }
}
```

### Access the application

| URL | Description |
|---|---|
| `https://your-domain.com/opd` | Clinical frontend |
| `https://your-domain.com/api/health` | Health dashboard |
| `https://your-domain.com/api/health/live` | Liveness probe |
| `https://your-domain.com/api/health/ready` | Readiness probe |

---

## 6. Database Migration

Migrations run automatically when the backend container starts. To run manually:

```bash
# Inside the running backend container
docker exec -it medflow_backend sh
npx prisma migrate deploy

# Or from host
docker exec medflow_backend npx prisma migrate deploy
```

---

## 7. Backup Setup

Configure automated backups via cron:

```bash
# Make backup script executable
chmod +x scripts/backup.sh scripts/restore.sh

# Create backup directory
mkdir -p /var/backups/medflow/daily /var/backups/medflow/weekly

# Add to crontab (run: crontab -e)
# Daily backup at 2:00 AM
0 2 * * * /path/to/medflow/scripts/backup.sh >> /var/log/medflow-backup.log 2>&1
# Weekly backup on Sunday at 3:00 AM
0 3 * * 0 /path/to/medflow/scripts/backup.sh --type weekly >> /var/log/medflow-backup.log 2>&1
```

---

## 8. Troubleshooting

### Backend fails to start

```bash
# Check backend logs
docker compose -f docker-compose.production.yml logs backend

# Common cause: DATABASE_URL wrong
# Verify postgres is healthy first
docker compose -f docker-compose.production.yml ps postgres
```

### Redis connection refused

```bash
# Verify REDIS_PASSWORD matches in .env.production
docker exec medflow_redis redis-cli -a $REDIS_PASSWORD ping
# Expected: PONG
```

### Nginx 502 Bad Gateway

```bash
# Backend or frontend not yet ready — check:
docker compose -f docker-compose.production.yml ps
# Wait for all services to show "healthy"
```
