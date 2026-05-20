# MedFlow OPD System — Disaster Recovery Guide

> **RTO Target:** < 2 hours | **RPO Target:** < 24 hours (daily backup)

## Disaster Scenarios & Response Matrix

| Scenario | Severity | RTO | Response |
|---|---|---|---|
| Backend container crash | Low | 30s | Auto-restart via Docker policy |
| Redis restart/crash | Medium | 1 min | Auto-restart; BullMQ re-queues jobs |
| Database corruption | High | 1-2 hrs | Restore from backup |
| Server hardware failure | Critical | 2-4 hrs | Provision new server + restore |
| SSL certificate expiry | Medium | 15 min | Renew via certbot |

---

## Recovery Procedures

### Scenario 1 — Service Crash (Auto-Recovery)
All containers have `restart: always`. Recovery is automatic in 30-60 seconds.

```bash
docker compose -f docker-compose.production.yml ps
docker compose -f docker-compose.production.yml logs --tail=50 backend
```

### Scenario 2 — Database Corruption

```bash
# 1. Stop backend
docker compose -f docker-compose.production.yml stop backend frontend

# 2. List available backups
ls -la /var/backups/medflow/daily/

# 3. Restore (to NEW database — safe)
./scripts/restore.sh --latest --confirm

# 4. Update DATABASE_URL to restored DB name, restart
docker compose -f docker-compose.production.yml --env-file .env.production up -d backend frontend

# 5. Verify
curl https://your-domain.com/api/health
```

### Scenario 3 — Complete Server Loss

```bash
# On new server:
git clone https://github.com/your-org/medflow-opd.git /opt/medflow
cd /opt/medflow

# Restore .env.production from secure vault
# Transfer backup files from offsite storage
scp backup-user@backup-server:/backups/medflow/ /var/backups/medflow/ -r

# Start stack and restore
docker compose -f docker-compose.production.yml --env-file .env.production up -d --build
./scripts/restore.sh --latest --confirm
```

### Scenario 4 — Redis Data Loss

Redis holds cache and BullMQ state only. Simply restart:

```bash
docker compose -f docker-compose.production.yml restart redis
# Cache re-warms automatically on next API calls or 2AM cron job
```

### Scenario 5 — SSL Certificate Expiry

```bash
certbot renew
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /opt/medflow/nginx/ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem   /opt/medflow/nginx/ssl/
docker exec medflow_nginx nginx -s reload
```

---

## Backup Architecture

```
Daily  (2AM)  → /var/backups/medflow/daily/   → retain 14 days
Weekly (3AM)  → /var/backups/medflow/weekly/  → retain 8 weeks
```

Each backup is gzip-compressed and integrity-checked automatically.

## Offsite Backup (Recommended)

```bash
# Sync to S3 after each backup
aws s3 sync /var/backups/medflow/ s3://your-medflow-backups/

# Or rsync to remote server
rsync -avz /var/backups/medflow/ backup@remote:/backups/medflow/
```

## Recovery Testing Schedule

| Test | Frequency |
|---|---|
| Backup integrity check | Daily (automated in backup.sh) |
| Manual restore test | Monthly |
| Full DR simulation | Quarterly |
