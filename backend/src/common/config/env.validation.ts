import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // ── Runtime ──────────────────────────────────────────────────────────────
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),

  // ── Database ─────────────────────────────────────────────────────────────
  DATABASE_URL: Joi.string().required(),

  // ── Security ─────────────────────────────────────────────────────────────
  JWT_SECRET: Joi.string().required().min(32),
  JWT_EXPIRES_IN: Joi.string().default('8h'),

  // ── CORS ─────────────────────────────────────────────────────────────────
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),

  // ── File Storage ─────────────────────────────────────────────────────────
  UPLOAD_DIR: Joi.string().default('uploads'),
  MAX_FILE_SIZE: Joi.number().default(10485760), // 10MB

  // ── Redis ─────────────────────────────────────────────────────────────────
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional().allow(''), // Optional in dev, required in prod

  // ── SMTP (Optional — for future email notifications) ──────────────────────
  SMTP_HOST: Joi.string().optional().allow(''),
  SMTP_PORT: Joi.number().optional().default(587),
  SMTP_SECURE: Joi.boolean().optional().default(false),
  SMTP_USER: Joi.string().optional().allow(''),
  SMTP_PASS: Joi.string().optional().allow(''),
  SMTP_FROM: Joi.string().optional().allow(''),

  // ── Application ───────────────────────────────────────────────────────────
  APP_NAME: Joi.string().default('MedFlow OPD System'),
  CLINIC_NAME: Joi.string().optional().allow(''),
});
