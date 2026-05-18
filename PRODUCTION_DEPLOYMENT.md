# MedFlow OPD System — Production Deployment Guide

## Architecture Overview

```
Internet
   │
   ▼
┌──────────────────────────────────────────────────────┐
│  Nginx (Port 80/443)  — Reverse Proxy + SSL          │
│  • /opd        → frontend:3000 (Next.js SSR)         │
│  • /api        → backend:3001  (NestJS REST)         │
│  • /socket.io  → backend:3001  (Socket.IO WS)        │
└──────────────────┬───────────────────────────────────┘
                   │ Internal Network (medflow_internal)
        ┌──────────┴──────────┐
        ▼                     ▼
┌───────────────┐    ┌────────────────────┐
│ Frontend      │    │ Backend            │
│ Next.js:3000  │    │ NestJS:3001        │
│ SSR Mode      │    │ + BullMQ Workers   │
│ basePath:/opd │    │ + Socket.IO WS     │
└───────────────┘    └────────┬───────────┘
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
       ┌───────────────┐           ┌──────────────────┐
       │ PostgreSQL    │           │ Redis            │
       │ Port: 5432    │           │ Port: 6379       │
       │ Volume mount  │           │ AOF persistence  │
       │ (localhost    │           │ 256MB maxmemory  │
       │  only)        │           │ (localhost only) │
       └───────────────┘           └──────────────────┘
```

---

## Network Security Design

| Network | Type | Purpose |
|---|---|---|
| `medflow_external` | Bridge | Nginx ↔ Internet |
| `medflow_internal` | Bridge (internal) | All services (cannot reach internet directly) |

- **PostgreSQL** bound to `127.0.0.1:5432` — not exposed to internet
- **Redis** bound to `127.0.0.1:6379` — not exposed to internet
- **Backend** exposed only within internal Docker network
- **Frontend** exposed only within internal Docker network
- **Nginx** is the only internet-facing service

---

## Pre-Deployment Checklist

- [ ] `.env.production` filled with real credentials
- [ ] `JWT_SECRET` is 48+ characters (generated with `openssl rand -base64 48`)
- [ ] `REDIS_PASSWORD` set
- [ ] `POSTGRES_PASSWORD` set (strong, unique)
- [ ] SSL certificates in `nginx/ssl/` (`fullchain.pem` + `privkey.pem`)
- [ ] `CORS_ORIGIN` matches your actual domain
- [ ] Firewall allows ports 80 and 443 only
- [ ] Backup directory created (`/var/backups/medflow/`)
- [ ] Cron jobs configured for automated backups
- [ ] Server has minimum 2GB RAM, 20GB disk

---

## Deployment Steps

### Step 1 — Prepare Server

```bash
# Install Docker on Ubuntu
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
docker compose version
```

### Step 2 — Deploy Application

```bash
# Clone or pull latest code
git clone https://github.com/your-org/medflow-opd.git /opt/medflow
cd /opt/medflow

# Configure environment
cp .env.example.enterprise .env.production
nano .env.production   # Fill all required values

# Place SSL certificates
mkdir -p nginx/ssl
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem   nginx/ssl/

# Build and start production stack
docker compose -f docker-compose.production.yml --env-file .env.production up -d --build
```

### Step 3 — Verify Deployment

```bash
# Check all services are healthy
docker compose -f docker-compose.production.yml ps

# Expected output:
# medflow_postgres   Up (healthy)
# medflow_redis      Up (healthy)
# medflow_backend    Up (healthy)
# medflow_frontend   Up (healthy)
# medflow_nginx      Up

# Test health endpoint
curl -k https://your-domain.com/api/health
```

### Step 4 — Configure Backups

```bash
chmod +x /opt/medflow/scripts/backup.sh /opt/medflow/scripts/restore.sh
mkdir -p /var/backups/medflow/daily /var/backups/medflow/weekly

# Add cron jobs
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/medflow/scripts/backup.sh >> /var/log/medflow-backup.log 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "0 3 * * 0 /opt/medflow/scripts/backup.sh --type weekly >> /var/log/medflow-backup.log 2>&1") | crontab -
```

---

## Updating the Application

### Rolling Update (Zero Downtime)

```bash
cd /opt/medflow

# Pull latest code
git pull origin main

# Rebuild and restart — services restart one at a time
docker compose -f docker-compose.production.yml --env-file .env.production up -d --build --no-deps backend
docker compose -f docker-compose.production.yml --env-file .env.production up -d --build --no-deps frontend

# Migrations run automatically via backend entrypoint CMD
```

### Full Restart

```bash
docker compose -f docker-compose.production.yml --env-file .env.production down
docker compose -f docker-compose.production.yml --env-file .env.production up -d --build
```

---

## Monitoring

### Real-time Logs

```bash
# All services
docker compose -f docker-compose.production.yml logs -f

# Backend only
docker compose -f docker-compose.production.yml logs -f backend

# Nginx access log
docker exec medflow_nginx tail -f /var/log/nginx/access.log
```

### Resource Usage

```bash
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

### BullMQ Queue Status

```bash
# Check queue depths via health endpoint
curl https://your-domain.com/api/health | jq '.info.bullmq'
```

---

## Scaling Considerations

### Horizontal Scaling (Multiple Backend Instances)

The backend is WebSocket-scaled via Redis adapter already. To run multiple replicas:

```yaml
# In docker-compose.production.yml, add to backend service:
deploy:
  replicas: 3
```

Socket.IO will use Redis pub/sub to broadcast events across all replicas automatically.

### Database Connection Pooling

For high-concurrency production:
- Add PgBouncer between backend and PostgreSQL
- Prisma connection limit: set `DATABASE_URL=...&connection_limit=20`

---

## Environment Rotation

### Rotating JWT Secret (Forces all users to re-login)

```bash
# Generate new secret
NEW_SECRET=$(openssl rand -base64 48)

# Update .env.production
sed -i "s|JWT_SECRET=.*|JWT_SECRET=$NEW_SECRET|" .env.production

# Restart backend
docker compose -f docker-compose.production.yml --env-file .env.production up -d --no-deps backend
```

### Rotating Redis Password

```bash
# Update .env.production with new REDIS_PASSWORD
# Then restart Redis and backend together:
docker compose -f docker-compose.production.yml --env-file .env.production up -d --no-deps redis backend
```
