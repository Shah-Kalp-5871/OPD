import { APP_CONFIG } from './config';
import { buildAppUrl } from './routes';

/**
 * Normalizes any path by removing multiple sequential slashes and trailing slashes.
 */
export const normalizePath = (path: string): string => {
  if (!path) return '';
  // Replace multiple slashes with a single slash
  let normalized = path.replace(/\/+/g, '/');
  // Remove trailing slash unless it is the root path '/'
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  // Ensure starts with a slash
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  return normalized;
};

/**
 * Returns the configured base path.
 */
export const getBasePath = (): string => {
  return APP_CONFIG.BASE_PATH;
};

/**
 * Constructs a fully qualified API endpoint URL.
 */
export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${APP_CONFIG.API_BASE_URL}/api${cleanEndpoint}`;
};

/**
 * Builds a path for dynamic clinical tenant scopes.
 */
export const getTenantRoute = (tenantId: string, path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/tenant/${tenantId}${cleanPath}`;
};

/**
 * Resolves public assets (images, icons, etc.) with correct deployment basePath scope.
 */
export const getAssetPath = (path: string): string => {
  if (!path) return '';
  // If already absolute or fully qualified, return as-is
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Prevent double prefixing
  if (cleanPath.startsWith(APP_CONFIG.BASE_PATH)) {
    return cleanPath;
  }
  
  return `${APP_CONFIG.BASE_PATH}${cleanPath}`;
};

// Aliasing getAssetUrl for absolute compliance
export const getAssetUrl = getAssetPath;

/**
 * Performs client-side redirection safely, validating the destination to prevent open-redirect vulnerabilities.
 */
export const safeRedirect = (url: string): void => {
  if (typeof window === 'undefined') return;

  const targetUrl = buildAppUrl(url);

  // Prevent open redirect by validating it starts with the basePath or is a relative/internal path
  const isInternal = targetUrl.startsWith('/') || targetUrl.startsWith(APP_CONFIG.BASE_PATH);
  
  if (isInternal) {
    window.location.href = targetUrl;
  } else {
    console.error(`Blocked unsafe redirection to external URL: ${url}`);
    window.location.href = buildAppUrl('/');
  }
};
