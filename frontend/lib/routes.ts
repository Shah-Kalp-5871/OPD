import { APP_CONFIG } from './config';

/**
 * Centralized Route Management for MedFlow
 * Defines both legacy flat-keys for backwards compatibility and the clean nested routes structure.
 */
export const ROUTES = {
  // Core routes
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Dashboards (flat legacy keys)
  ADMIN: '/admin',
  DOCTOR: '/doctor',
  RECEPTION: '/reception',
  NURSING: '/nursing',
  MEDICAL: '/medical',
  LABORATORY: '/laboratory',
  PHARMACY: '/pharmacy',

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

  // Task 1 — Centralized Route Structure
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    FORGOT: '/forgot-password',
    RESET: '/reset-password',
  },

  DASHBOARD: '/dashboard',

  PATIENTS: {
    LIST: '/admin/patients',
    CREATE: '/admin/patients/create',
  },

  BILLING: '/admin/billing',

  GLOBAL: {
    COMMAND_CENTER: '/global-command-center',
    LIVE_QUEUE: '/live-queue',
    MARKETPLACE: '/marketplace',
    FINANCIAL_REPORTS: '/admin/reports/financial',
    INVENTORY_INTELLIGENCE: '/admin/reports/inventory',
    ERP_INTELLIGENCE: '/erp-intelligence',
    HRMS: '/hrms',
    WORKFORCE: '/workforce',
    PAYROLL: '/payroll',
    PROCUREMENT: '/procurement',
    PHARMACY_INTELLIGENCE: '/pharmacy-intelligence',
    BIOMEDICAL: '/biomedical',
    FACILITY_OPS: '/facility-ops',
    DEVELOPER: '/developer',
    EXECUTIVE: '/executive',
    ANALYTICS_STUDIO: '/analytics-studio',
    OBSERVABILITY_ANALYTICS: '/observability/analytics',
  },

  SECURITY: {
    COMMAND_CENTER: '/security-command-center',
  },

  GLOBAL_COMMAND: '/global-command-center',

  // Domain nested structures (Modern API)
  admin: {
    dashboard: '/admin/dashboard',
    patients: '/admin/patients',
    appointments: '/admin/appointments',
    doctors: '/admin/doctors',
    staff: '/admin/staff',
    billing: '/admin/billing',
    drugs: '/admin/drugs',
    lab: '/admin/lab',
    procedures: '/admin/procedures',
    reports: '/admin/reports',
    securityCommandCenter: '/admin/security-command-center',
    settings: '/admin/settings',
    profile: '/admin/profile',
  },

  doctor: {
    dashboard: '/doctor/dashboard',
    queue: '/doctor/queue',
    consultation: '/doctor/consultation',
    consultationComplaints: '/doctor/consultation/complaints',
    appointments: '/doctor/appointments',
    followupCallList: '/doctor/followup-call-list',
    billingView: '/doctor/billing-view',
    pharmacy: '/doctor/pharmacy',
    reports: '/doctor/reports',
    profile: '/doctor/profile',
  },

  reception: {
    dashboard: '/reception/dashboard',
    appointments: '/reception/appointments',
    billing: '/reception/billing',
    checkin: '/reception/checkin',
    consent: '/reception/consent',
    lab: '/reception/lab',
    labUpload: '/reception/lab-upload',
    myProfile: '/reception/profile',
    register: '/reception/register',
    search: '/reception/search',
    queue: '/reception/queue',
    patients: '/reception/patients',
  },

  nursing: {
    dashboard: '/nursing/dashboard',
    queue: '/nursing/queue',
    vitals: '/nursing/vitals',
    followup: '/nursing/followup',
    labReports: '/nursing/lab-reports',
    profile: '/nursing/profile',
  },

  medical: {
    dashboard: '/medical/dashboard',
    dispensing: '/medical/dispensing',
    stock: '/medical/stock',
    returns: '/medical/returns',
    alerts: '/medical/alerts',
    profile: '/medical/profile',
  },

  pharmacy: {
    dashboard: '/pharmacy/dashboard',
    queue: '/pharmacy/queue',
    inventory: '/pharmacy/inventory',
  },

  laboratory: {
    dashboard: '/laboratory',
  }
} as const;

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
  'LAB_TECHNICIAN': ROUTES.laboratory.dashboard,
};

/**
 * Builds a full client-side URL including the application's base path.
 * Safeguards against duplicate base paths.
 */
export const buildAppUrl = (path: string): string => {
  if (!path) return '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (cleanPath.startsWith(APP_CONFIG.BASE_PATH)) {
    return cleanPath;
  }
  
  return `${APP_CONFIG.BASE_PATH}${cleanPath}`;
};
