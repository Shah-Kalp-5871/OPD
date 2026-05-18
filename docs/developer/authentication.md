# MedFlow Public API — Authentication

## API Keys

```bash
curl -H "X-Api-Key: mf_live_YOUR_KEY" https://api.medflow.health/api/v2/patients
```

Alternative header: `Authorization: ApiKey mf_live_...`

## OAuth 2.0

- Register: `POST /api/v2/oauth/register`
- Token: `POST /api/v2/oauth/token`
- Supports authorization_code (PKCE) and client_credentials

## Tenant Isolation

Every API client is bound to a `tenantId` and optional `branchId`. Cross-tenant access is rejected.
