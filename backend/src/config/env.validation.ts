import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(5000),
  API_PREFIX: Joi.string().default('/api/v1'),
  CORS_ORIGIN: Joi.string().default('http://localhost:5173'),
  MONGODB_URI: Joi.string().uri().required(),
  REDIS_URI: Joi.string().uri().required(),
});
