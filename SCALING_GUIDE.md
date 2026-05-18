# MedFlow OPD System — Scaling Guide

## Current Architecture Capacity

| Component | Current Config | Safe Concurrency |
|---|---|---|
| NestJS Backend | Single container, 512MB | ~200 concurrent users |
| Next.js Frontend | Single container, 256MB | ~500 concurrent requests |
| PostgreSQL | Single container | ~100 active connections |
| Redis | 256MB maxmemory, allkeys-lru | ~50K keys |
| BullMQ | 3 queues (notifications/appointments/reports) | ~1000 jobs/hour |
| WebSocket | Redis adapter — horizontally scalable | Unlimited with replicas |
| Rate Limit | 100 req/min per IP (NestJS Throttler) | Configurable |
| Upload | 10MB max per file | Nginx: 15MB limit |

---

## Vertical Scaling (Single Server)

Increase resource limits in `docker-compose.production.yml`:

```yaml
# backend service
deploy:
  resources:
    limits:
      memory: 1G    # Increase from 512M
      cpus: '2.0'   # Add CPU limit

# postgres service
deploy:
  resources:
    limits:
      memory: 1G
```

**Recommended minimum for 100+ concurrent clinical users:**
- Server: 4 vCPU, 8GB RAM, SSD
- PostgreSQL: 1GB memory limit
- Backend: 1GB memory limit, 2 replicas

---

## Horizontal Scaling (Multiple Backend Instances)

WebSocket is already Redis-scaled via `RedisIoAdapter`. Adding replicas requires only one change:

### Option A: Docker Compose Replicas

```yaml
# docker-compose.production.yml
backend:
  deploy:
    replicas: 3      # Add this
```

Then update Nginx upstream to load balance:

```nginx
# nginx/conf.d/medflow.conf
upstream medflow_backend {
    server backend:3001;   # Docker handles routing to replicas
    keepalive 64;
}
```

### Option B: Dedicated BullMQ Worker Process

For heavy analytics jobs, run workers as a separate service:

```yaml
# Add to docker-compose.production.yml
bullmq-worker:
  build:
    context: ./backend
    dockerfile: Dockerfile
  container_name: medflow_worker
  restart: always
  depends_on:
    postgres:
      condition: service_healthy
    redis:
      condition: service_healthy
  environment:
    # Same as backend
    NODE_ENV: production
    DATABASE_URL: ...
    REDIS_HOST: redis
    REDIS_PASSWORD: ...
  command: node dist/jobs/worker-entry.js   # Separate entry point
  networks:
    - medflow_internal
```

---

## Database Scaling

### Connection Pooling with PgBouncer

For 200+ concurrent users, add PgBouncer:

```yaml
pgbouncer:
  image: edoburu/pgbouncer:latest
  environment:
    DATABASE_URL: postgres://medflow:$POSTGRES_PASSWORD@postgres:5432/medflow_db
    POOL_MODE: transaction
    MAX_CLIENT_CONN: 500
    DEFAULT_POOL_SIZE: 20
  networks:
    - medflow_internal
```

Update `DATABASE_URL` in backend to point to PgBouncer:
```
DATABASE_URL=postgresql://medflow:pass@pgbouncer:5432/medflow_db?schema=public
```

### Read Replicas (Future)

For analytics-heavy loads, route read-only analytics queries to a replica:
- Add PostgreSQL streaming replica
- Create separate `DATABASE_URL_REPLICA` env var
- Route analytics service queries to replica

---

## Redis Scaling

Current Redis config (`maxmemory 256mb`, `allkeys-lru`) is suitable for multi-branch caching.

For very high scale (10+ branches, 1000+ concurrent users):

```yaml
# Increase Redis memory
redis:
  command: >
    redis-server
    --requirepass ${REDIS_PASSWORD}
    --maxmemory 1gb        # Increase
    --maxmemory-policy allkeys-lru
    --appendonly yes
```

### Redis Sentinel (High Availability)

For zero-downtime Redis, implement Redis Sentinel (3-node setup):
- Primary + 2 replicas
- Automatic failover in < 30 seconds
- Update `REDIS_HOST` to Sentinel endpoint

---

## Frontend Scaling

Next.js SSR in production scales by:
1. Increasing replica count in docker-compose
2. Nginx automatically load-balances across replicas

For CDN acceleration:
- Put Cloudflare or AWS CloudFront in front of Nginx
- Cache static assets (`/_next/static/`) at CDN layer
- Dynamic SSR responses remain server-rendered

---

## Kubernetes Readiness

The health endpoints are Kubernetes-probe compatible:

```yaml
# Example Kubernetes deployment spec (not provided — future phase)
livenessProbe:
  httpGet:
    path: /api/health/live
    port: 3001
  initialDelaySeconds: 60
  periodSeconds: 30

readinessProbe:
  httpGet:
    path: /api/health/ready
    port: 3001
  initialDelaySeconds: 30
  periodSeconds: 10
```

The architecture (stateless backend + Redis state + PostgreSQL) is fully Kubernetes-compatible.
