# MedFlow OPD System — Operations Runbook

## Daily Operations

### Morning Health Check

```bash
# Check all services healthy
docker compose -f docker-compose.production.yml ps

# Check health endpoint
curl -s https://your-domain.com/api/health | jq '.status'
# Expected: "ok"

# Check last night's backup
ls -lah /var/backups/medflow/daily/ | tail -3
tail -20 /var/log/medflow-backup.log
```

### Resource Monitoring

```bash
# CPU + Memory per container
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

# Disk usage
df -h /var/backups/medflow/
docker system df
```

---

## Common Operations

### Restart a Single Service

```bash
# Backend only
docker compose -f docker-compose.production.yml restart backend

# Frontend only
docker compose -f docker-compose.production.yml restart frontend

# Nginx reload (no downtime)
docker exec medflow_nginx nginx -s reload

# Full stack restart
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml --env-file .env.production up -d
```

### View Logs

```bash
# Live backend logs
docker compose -f docker-compose.production.yml logs -f backend

# Last 100 lines of nginx errors
docker exec medflow_nginx tail -100 /var/log/nginx/error.log

# BullMQ job activity (appears in backend logs)
docker compose -f docker-compose.production.yml logs backend | grep -i "bull\|queue\|job"
```

### Manual Database Backup

```bash
./scripts/backup.sh
# Output: /var/backups/medflow/daily/medflow_daily_YYYYMMDD_HHMMSS.sql.gz
```

### Run Prisma Migrations Manually

```bash
# Migrations also run automatically on backend startup
docker exec medflow_backend npx prisma migrate deploy
```

### Connect to Database

```bash
# Via psql inside container
docker exec -it medflow_postgres psql -U medflow -d medflow_db

# Via Prisma Studio (on local dev)
cd backend && npx prisma studio
```

### Connect to Redis

```bash
docker exec -it medflow_redis redis-cli -a $REDIS_PASSWORD ping
# PONG

# Check cache keys
docker exec -it medflow_redis redis-cli -a $REDIS_PASSWORD keys "branch:*"

# Check BullMQ queue depths
docker exec -it medflow_redis redis-cli -a $REDIS_PASSWORD llen bull:reports:wait
```

---

## Incident Response

### High Memory Usage (Backend > 400MB)

```bash
# Check what's consuming memory
docker stats medflow_backend --no-stream

# Force restart (backend auto-restarts)
docker restart medflow_backend

# If recurring: check for memory leak in analytics cron job logs
docker logs medflow_backend | grep -i "memory\|heap\|oom"
```

### Database Slow Queries

```bash
# Connect and check running queries
docker exec -it medflow_postgres psql -U medflow -d medflow_db -c "
  SELECT pid, now() - query_start AS duration, query
  FROM pg_stat_activity
  WHERE state = 'active' AND now() - query_start > interval '5 seconds'
  ORDER BY duration DESC;
"
```

### BullMQ Jobs Stuck

```bash
# Check queue status via health endpoint
curl -s https://your-domain.com/api/health | jq '.info.bullmq'

# Clear failed jobs via Redis CLI
docker exec -it medflow_redis redis-cli -a $REDIS_PASSWORD \
  del bull:reports:failed
```

### Nginx 502 Bad Gateway

```bash
# Step 1: Check backend health
docker compose -f docker-compose.production.yml ps backend

# Step 2: Check backend logs
docker compose -f docker-compose.production.yml logs --tail=30 backend

# Step 3: Restart backend
docker compose -f docker-compose.production.yml restart backend

# Step 4: Verify Nginx config is valid
docker exec medflow_nginx nginx -t
```

---

## Maintenance Windows

### Applying Code Updates

```bash
cd /opt/medflow

# Create pre-update backup
./scripts/backup.sh

# Pull latest code
git pull origin main

# Rebuild backend only (frontend if changed)
docker compose -f docker-compose.production.yml --env-file .env.production \
  up -d --build --no-deps backend

# Migrations run automatically in backend entrypoint
# Monitor for startup errors
docker compose -f docker-compose.production.yml logs -f backend --until=60s
```

### Cleaning Up Old Docker Resources

```bash
# Remove dangling images (safe)
docker image prune -f

# Remove stopped containers (safe)
docker container prune -f

# Full cleanup (WARNING: removes ALL unused resources)
# docker system prune -f
```

---

## Escalation Contacts

> Fill in with your team's actual contacts before going to production.

| Role | Name | Contact |
|---|---|---|
| On-Call Engineer | | |
| Database Admin | | |
| System Admin | | |
| Clinical IT Lead | | |
