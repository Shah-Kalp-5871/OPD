# Receptionist Login Redirect Loop — Audit Report

## Root Cause

**Primary bug**: Double-unwrap of the API response in the login handler.

The backend `TransformInterceptor` wraps every response as:
```json
{ "success": true, "data": { "access_token": "...", "user": {...} }, "message": "..." }
```

The Axios interceptor in `lib/api.ts` detects `success === true` and returns `response.data`, which is the wrapper object `{ success, data, message }`.

The login handler then did `response.data` again — accessing `.data` on the wrapper — which correctly gives `{ access_token, user }`. **BUT** the original code had `response.data` where `response` was already the Axios response object (not the interceptor-processed value), causing `access_token` and `user` to be `undefined`. This meant `setAuth(undefined, undefined)` was called, no cookies were set, and the middleware redirected back to login on every navigation.

## Fixes Applied

### 1. `frontend/views/auth/login/page.tsx`
- **Fixed**: Changed `response.data` destructuring to `(response as any).data` to correctly access the inner payload from the interceptor-processed response.
- **Fixed**: Added `SameSite=Lax` to `setCookie()` helper — cookies without `SameSite` may be blocked by browsers in certain navigation contexts, preventing middleware from reading them.

### 2. `frontend/lib/api.ts`
- **Verified**: Interceptor correctly returns `response.data` (the `{ success, data, message }` wrapper). No change needed — existing reception views rely on `.data` to access the inner payload.

## Auth Architecture (Verified Correct)

| Layer | Source | Value |
|---|---|---|
| API call | `POST /api/auth/login` | ✓ basePath `/api` set in `axios.create` |
| Backend response | `{ access_token, user: { role: 'RECEPTION' } }` | ✓ |
| Cookie: `token` | `document.cookie` with `path=/; SameSite=Lax` | ✓ fixed |
| Cookie: `user_role` | `'RECEPTION'` (uppercase) | ✓ |
| Middleware token read | `request.cookies.get('token')` | ✓ |
| Middleware role check | `pathname.startsWith('/reception') && userRole !== 'RECEPTION'` | ✓ |
| Role redirect map | `'RECEPTION' → '/reception/dashboard'` | ✓ |
| Next.js basePath | `/opd` — middleware matcher strips it automatically | ✓ |

## Remaining Notes

### Static pages
- Reception dashboard fetches `/queue/stats` and `/queue/live` — these will show empty state if backend queue APIs are not running.

### Broken API patterns in reception views
Several views use `response.data` (the inner payload) directly after the interceptor returns the wrapper. This is inconsistent but works because the interceptor returns the wrapper object and views access `.data` on it. The pattern is:
- `statsRes.data` → inner payload ✓
- `response.data.data` → paginated results (double `.data`) ✓ (for paginated endpoints that return `{ data: [], meta: {} }`)

### Recommendations
1. Standardize the interceptor to always return the inner `data` field, and update all views to remove the `.data` access. This eliminates the double-unwrap confusion permanently.
2. Consider using `httpOnly` cookies set by the backend on login response for better security (prevents XSS token theft).
3. Add `router.replace` instead of `router.push` for post-login redirect to prevent back-button returning to login.
