/**
 * Centralized Configuration Management for MedFlow
 * Environment-aware parameters for routing, APIs, and deployments.
 */
export const APP_CONFIG = {
  // Backend API Server base endpoint
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',

  // Next.js routing basePath scope
  BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '/opd',

  // Environment type flag
  NODE_ENV: process.env.NODE_ENV || 'development',
};
