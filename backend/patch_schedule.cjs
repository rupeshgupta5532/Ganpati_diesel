const fs = require('fs');

// Patch app.module.ts
let appCode = fs.readFileSync('src/app.module.ts', 'utf8');
appCode = appCode.replace("import { ScheduleModule } from '@nestjs/schedule';\n", "");
appCode = appCode.replace("    ScheduleModule.forRoot(),\n", "");
fs.writeFileSync('src/app.module.ts', appCode);

// Patch audit-logs.service.ts
let auditCode = fs.readFileSync('src/audit-logs/audit-logs.service.ts', 'utf8');
auditCode = auditCode.replace("import { Cron, CronExpression } from '@nestjs/schedule';\n", "");
auditCode = auditCode.replace("@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)\n", "");
fs.writeFileSync('src/audit-logs/audit-logs.service.ts', auditCode);

