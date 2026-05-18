# Phase 26/33 — Enterprise API Gateway, Developer Portal & API Monetization

**Status: COMPLETE**

## Architecture Summary

Phase 26 extends MedFlow with a production-grade **Public API platform** layered on the existing `PublicApiModule`. All public routes enforce **tenant + branch isolation** via `PublicApiScopeService`, API key/OAuth authentication, Redis sliding-window rate limits, monthly quotas, immutable audit logs, and usage metering tied to SaaS billing models.

```
External Client → Ingress (rate limit/WAF) → NestJS Public API
  → ApiKeyGuard → ApiQuotaGuard → RateLimitGuard
  → Controller (tenant-scoped Prisma queries)
  → ApiAuditInterceptor + ApiUsageService → SubscriptionUsage / FeatureUsageLog
  → WebhookCatalogService → BullMQ webhook processor (HMAC-SHA256)
```

## Modules Added / Extended

| Module / Service | Purpose |
|------------------|---------|
| `PublicApiScopeService` | Resolves branch IDs, builds tenant-safe Prisma filters |
| `RequestApiClientContext` + `@ApiClientCtx()` | Typed request context decorator |
| `ApiClientAdminService` / `ApiClientAdminController` | Internal API client CRUD, key rotate/revoke |
| `ApiUsageService` / `ApiUsageController` | Metering, quotas, analytics |
| `ApiQuotaGuard` | Monthly quota enforcement |
| `WebhookCatalogService` | Event registry, replay, dead-letter |
| `WebhookRegistryController` | Public + admin webhook catalog APIs |
| `PublicApiDocsController` | Onboarding + OpenAPI spec endpoint |

## Prisma Models Added / Extended

**Extended `ApiClient`:** `branchId`, `rateLimitPerMinute`, `monthlyQuota`, `monthlyUsageCount`, `usageResetAt`, `lastUsedAt`

**New:**
- `ApiUsageRecord` — per-request telemetry
- `ApiUsageMonthlySummary` — aggregated billing summaries

## Security Measures

- Tenant/branch scoping on all public patient & appointment queries
- Hashed API keys (`mf_live_` / `mf_test_` prefixes)
- RBAC `API_MANAGE` on admin endpoints (`JwtAuthGuard`, `PermissionsGuard`, `TenantGuard`)
- PHI-safe audit logs (no patient payloads in `ApiAuditLog`)
- Rate-limit rejection + auth failure audit entries
- HMAC-SHA256 webhook signatures (`X-MedFlow-Signature`)
- Correlation ID propagation (`x-correlation-id`)

## API Gateway Structure

- `k8s/api-gateway/ingress.yaml` — version routing, edge RPS, timeouts, CORS
- `k8s/api-gateway/waf-config.yaml` — ModSecurity rules
- `infrastructure/gateway/README.md` — architecture notes
- `observability/api-gateway/alerts.yaml` — 429 & webhook failure alerts

## Usage Metering Summary

- `ApiUsageService.recordUsage()` on every successful public API call
- Increments `ApiClient.monthlyUsageCount` + `SubscriptionUsage` (`API_CALLS`)
- `FeatureUsageLog` entries with `PUBLIC_API` feature key
- Monthly cron aggregation (`CronService.handleApiUsageAggregation`)
- Admin analytics: top endpoints, per-client consumption

## Webhook Architecture

- 10+ cataloged clinical/ops events (`patient.created`, `appointment.booked`, `lab.result.ready`, etc.)
- BullMQ exponential backoff (5 attempts) → `DEAD` dead-letter status
- Replay API: `POST /api/v2/webhooks/registry/deliveries/:id/replay`
- Delivery logs with truncated response bodies (PHI-safe)

## Frontend Dashboards

| Route | Feature |
|-------|---------|
| `/developer` | Overview, SDK cards, top endpoints |
| `/developer/api-keys` | Create, rotate, list clients |
| `/developer/oauth-apps` | OAuth client registry |
| `/developer/webhooks` | Event marketplace catalog |
| `/developer/usage` | Quota bars, tenant consumption |
| `/developer/docs` | Auth & onboarding |
| `/developer/playground` | Live API request inspector |

Integrated into `AdminSidebar.tsx` as **Developer Portal**.

## Documentation & SDK

- `docs/developer/openapi.yaml`
- `docs/developer/authentication.md`, `webhooks.md`, `rate-limits.md`
- `sdk/typescript/`, `sdk/python/`, `sdk/java/` scaffolding

## Build / Test Verification

```bash
cd backend && npx prisma generate && npx prisma db push && npm run build
cd backend && npm run test -- --testPathPatterns=public-api  # 22 passed
cd frontend && npm run build  # success, /developer/* routes included
```

---

**Next phase:** Phase 27/33 (per project roadmap).
