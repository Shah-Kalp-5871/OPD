/**
 * Centralized Route Management for OPD System
 * Handles basePath prefixing and standardizes navigation targets.
 */

export const APP_BASE_PATH = '/opd';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Dashboard routes (base paths)
  ADMIN: '/admin',
  DOCTOR: '/doctor',
  RECEPTION: '/reception',
  NURSING: '/nursing',
  MEDICAL: '/medical',
  LABORATORY: '/laboratory',
  PHARMACY: '/pharmacy',

  // Specific dashboard landing pages
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PATIENTS: '/admin/patients',
  ADMIN_APPOINTMENTS: '/admin/appointments',
  ADMIN_DOCTORS: '/admin/doctors',
  ADMIN_STAFF: '/admin/staff',
  ADMIN_BILLING: '/admin/billing',
  ADMIN_DRUGS: '/admin/drugs',
  ADMIN_LAB: '/admin/lab',
  ADMIN_PROCEDURES: '/admin/procedures',
  ADMIN_DISCOUNTS: '/admin/discounts',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_SUPPORT: '/admin/support',
  ADMIN_PROFILE: '/admin/profile',

  DOCTOR_DASHBOARD: '/doctor/dashboard',
  RECEPTION_DASHBOARD: '/reception/dashboard',
  NURSING_DASHBOARD: '/nursing/dashboard',
  MEDICAL_DASHBOARD: '/medical/dashboard',
  PHARMACY_DASHBOARD: '/pharmacy/dashboard',
};

/**
 * Maps User Roles to their respective landing pages
 */
export const ROLE_REDIRECT_MAP: Record<string, string> = {
  'ADMIN': ROUTES.ADMIN_DASHBOARD,
  'RECEPTION': ROUTES.RECEPTION_DASHBOARD,
  'DOCTOR': ROUTES.DOCTOR_DASHBOARD,
  'NURSING': ROUTES.NURSING_DASHBOARD,
  'MEDICAL': ROUTES.MEDICAL_DASHBOARD,
  'PHARMACY': ROUTES.PHARMACY_DASHBOARD,
  'LAB_TECHNICIAN': ROUTES.LABORATORY,
};

/**
 * Builds a full URL including the application base path.
 */
export const buildAppUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Prevent double prefixing if already prefixed
  if (cleanPath.startsWith(APP_BASE_PATH)) {
    return cleanPath;
  }
  
  return `${APP_BASE_PATH}${cleanPath}`;
};
