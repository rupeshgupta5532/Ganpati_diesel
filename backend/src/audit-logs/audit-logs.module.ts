import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { AuditInterceptor } from './interceptors/audit.interceptor';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  controllers: [AuditLogsController],
  providers: [
    AuditLogsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
  exports: [MongooseModule, AuditLogsService],
})
export class AuditLogsModule {}
