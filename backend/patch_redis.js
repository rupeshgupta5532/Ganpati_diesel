const fs = require('fs');
let code = fs.readFileSync('src/notifications/notifications.service.ts', 'utf8');

code = code.replace(
  "this.redisService.publish(\n      'notifications',\n      JSON.stringify({\n        room: `user:${userId}`,\n        data: notification,\n      }),\n    );",
  "try {\n      this.redisService.publish('notifications', JSON.stringify({ room: `user:${userId}`, data: notification }));\n    } catch(e) { this.logger.warn('Failed to publish notification to redis'); }"
);

code = code.replace(
  "this.redisService.publish(\n      'notifications',\n      JSON.stringify({\n        room: 'admin-room',\n        data: notification,\n      }),\n    );",
  "try {\n      this.redisService.publish('notifications', JSON.stringify({ room: 'admin-room', data: notification }));\n    } catch(e) { this.logger.warn('Failed to publish admin notification to redis'); }"
);

fs.writeFileSync('src/notifications/notifications.service.ts', code);
