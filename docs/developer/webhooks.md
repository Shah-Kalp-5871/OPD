# Webhooks

## Signing

MedFlow signs payloads with HMAC-SHA256. Verify using header `X-MedFlow-Signature`.

## Events

See `GET /api/v2/webhooks/registry/events` for the full catalog.

## Retries

5 attempts with exponential backoff. Failed deliveries move to dead-letter (`status: DEAD`). Replay via `POST /api/v2/webhooks/registry/deliveries/:id/replay`.
