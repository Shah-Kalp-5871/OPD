import axios from 'axios';
import { ROUTES, buildAppUrl } from '@/constants/routes';
import { APP_CONFIG } from '@/lib/config';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const baseUrlRaw = APP_CONFIG.API_BASE_URL || 'http://localhost:3001';
const baseURL = baseUrlRaw.endsWith('/api') ? baseUrlRaw : `${baseUrlRaw.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL,
});

export const secureFileUrl = (url: string) => {
  if (!url) return url;
  let resolvedUrl = url;

  if (typeof window !== 'undefined') {
    const baseUrl = APP_CONFIG.API_BASE_URL || window.location.origin;

    // Ensure we account for the global NestJS '/api' prefix for file storage routes
    let targetUrl = url;
    if (url.startsWith('/files/')) {
      targetUrl = `/api${url}`;
    } else if (url.startsWith('files/')) {
      targetUrl = `api/${url}`;
    }

    if (targetUrl.startsWith('/')) {
      resolvedUrl = `${baseUrl.replace(/\/$/, '')}${targetUrl}`;
    } else if (!/^https?:\/\//i.test(targetUrl)) {
      resolvedUrl = `${baseUrl.replace(/\/$/, '')}/${targetUrl.replace(/^\/+/, '')}`;
    }

    const token = localStorage.getItem('token');
    if (token) {
      return `${resolvedUrl}${resolvedUrl.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`;
    }
  }

  return resolvedUrl;
};

// Add a request interceptor to include the JWT token and active branch ID
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Retrieve the active branch ID from the auth store and add to headers
    const user = useAuthStore.getState().user;
    if (user && user.primaryBranchId) {
      config.headers['x-branch-id'] = user.primaryBranchId;
    }
  }
  return config;
});

// Add a response interceptor to handle errors and unwrap success
api.interceptors.response.use(
  (response) => {
    // If backend uses { success: true, data: ... }, unwrap it
    if (response.data && response.data.success === true) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on unauthorized
      if (typeof window !== 'undefined') {
        useAuthStore.getState().logout();
        toast.error('Session expired. Please login again.');

        const loginUrl = buildAppUrl(ROUTES.LOGIN);
        if (!window.location.pathname.includes(loginUrl)) {
          window.location.href = loginUrl;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
