/**
 * Legacy Facade for Route Configuration
 * Re-exports modern route configuration from @/lib/routes to maintain perfect backwards compatibility.
 */
export * from '@/lib/routes';
// Backwards compatibility binding
import { APP_CONFIG } from '@/lib/config';
export const APP_BASE_PATH = APP_CONFIG.BASE_PATH;
