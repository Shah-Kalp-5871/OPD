# Rate Limits

| Tier | Default |
|------|---------|
| Sandbox | 100 req/min |
| Production | 1000 req/min (configurable per client) |

Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

Monthly quotas enforced via `monthlyQuota` on each API client.
