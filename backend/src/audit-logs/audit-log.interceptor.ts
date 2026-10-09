import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditLogsService } from './audit-logs.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;

    // Only audit mutating methods or login
    if (['GET', 'HEAD', 'OPTIONS'].includes(method) && !req.url.includes('login')) {
      return next.handle();
    }

    // Exclude audit log fetch requests to prevent recursive logging
    if (req.url && req.url.includes('/admin/audit-logs')) {
      return next.handle();
    }

    const path = req.originalUrl || req.url || '';
    let action = 'UPDATE';
    if (method === 'POST') action = 'CREATE';
    if (method === 'DELETE') action = 'DELETE';

    let moduleName = 'ADMIN';
    if (path.includes('auth')) moduleName = 'AUTH';
    else if (path.includes('website-content')) moduleName = 'WEBSITE-CONTENT';
    else if (path.includes('contact')) moduleName = 'CONTACT';
    else if (path.includes('reviews')) moduleName = 'REVIEWS';
    else if (path.includes('bookings')) moduleName = 'BOOKINGS';
    else if (path.includes('products')) moduleName = 'PRODUCTS';
    else if (path.includes('services')) moduleName = 'SERVICES';
    else if (path.includes('projects')) moduleName = 'PROJECTS';
    else if (path.includes('enquiries')) moduleName = 'ENQUIRIES';

    const actorEmail = req.user?.email || req.body?.email || 'admin@ganpatidiesel.com';
    const actorRole = req.user?.role?.toLowerCase() || 'admin';
    const endpoint = `${method} ${path.replace('/api/v1', '')}`;
    const description = `User performed ${action} on ${moduleName.toLowerCase()}`;

    return next.handle().pipe(
      tap(() => {
        this.auditLogsService.createLog({
          action,
          status: 'SUCCESS',
          module: moduleName,
          endpoint,
          description,
          actorEmail,
          actorRole,
          ip: req.ip || req.connection?.remoteAddress,
          userAgent: req.headers ? req.headers['user-agent'] : undefined,
        }).catch(err => console.error('Failed to create audit log:', err));
      }),
      catchError((error) => {
        this.auditLogsService.createLog({
          action,
          status: 'ERROR',
          module: moduleName,
          endpoint,
          description,
          actorEmail,
          actorRole,
          ip: req.ip || req.connection?.remoteAddress,
          userAgent: req.headers ? req.headers['user-agent'] : undefined,
        }).catch(err => console.error('Failed to create audit log on error:', err));
        return throwError(() => error);
      })
    );
  }
}
