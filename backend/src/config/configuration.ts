export default () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  mongodbUri:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/ganpati_diesel',
  redisUri: process.env.REDIS_URI || 'redis://localhost:6379',
});
