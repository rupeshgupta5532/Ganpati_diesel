const fs = require('fs');
let code = fs.readFileSync('src/redis/redis.service.ts', 'utf8');

code = code.replace(
  "publish(channel: string, message: string) {\n    return this.pubClient.publish(channel, message);\n  }",
  "async publish(channel: string, message: string) {\n    try { return await this.pubClient.publish(channel, message); } catch (e) { console.warn('Redis publish failed', e.message); return null; }\n  }"
);

fs.writeFileSync('src/redis/redis.service.ts', code);
