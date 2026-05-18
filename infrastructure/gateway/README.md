# MedFlow API Gateway

Edge routing via NGINX Ingress with:

- API version routing (`/api/v2` public developer API)
- Redis-backed app rate limiting (RateLimitGuard)
- Ingress RPS limits (100/s burst 5x)
- WAF ModSecurity rules (`waf-config.yaml`)
- Correlation ID propagation (`x-correlation-id`)
- TLS termination and HSTS (application helmet)

Circuit breaker: configure upstream retries at ingress; backend uses BullMQ for async webhooks.
