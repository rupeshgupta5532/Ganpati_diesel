const fs = require('fs');
let code = fs.readFileSync('src/redis/redis.service.ts', 'utf8');

code = code.replace(
  "this.subClient = new Redis(url);\n  }",
  "this.subClient = new Redis(url);\n    \n    this.client.on('error', (err) => {});\n    this.pubClient.on('error', (err) => {});\n    this.subClient.on('error', (err) => {});\n  }"
);

fs.writeFileSync('src/redis/redis.service.ts', code);
