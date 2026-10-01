const fs = require('fs');
const file = 'src/redis/redis.service.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /this\.configService\.get<string>\('REDIS_URI'\) \|\| 'redis:\/\/localhost:6379';/,
  "this.configService.get<string>('REDIS_URI') || this.configService.get<string>('REDIS_URI') || 'redis://localhost:6379';"
);

const getCode = `  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis GET error:', error.message);
      return null;
    }
  }`;

code = code.replace(
  /async get\(key: string\): Promise<string \| null> \{\n    return this\.client\.get\(key\);\n  \}/,
  getCode
);

const setCode = `  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK' | null> {
    try {
      if (ttlSeconds) {
        return await this.client.set(key, value, 'EX', ttlSeconds);
      }
      return await this.client.set(key, value);
    } catch (error) {
      console.error('Redis SET error:', error.message);
      return null;
    }
  }`;

code = code.replace(
  /async set\(key: string, value: string, ttlSeconds\?: number\): Promise<'OK'> \{\n    if \(ttlSeconds\) \{\n      return this\.client\.set\(key, value, 'EX', ttlSeconds\);\n    \}\n    return this\.client\.set\(key, value\);\n  \}/,
  setCode
);

fs.writeFileSync(file, code);
