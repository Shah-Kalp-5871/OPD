import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required().min(32),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  UPLOAD_DIR: Joi.string().default('uploads'),
  MAX_FILE_SIZE: Joi.number().default(10485760), // 10MB
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
});
