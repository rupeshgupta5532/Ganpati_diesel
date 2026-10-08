import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditLogsService } from '../audit-logs.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    
    if (['POST', 'PUT', 'PATCH', 'DELETE', 'GET'].includes(method)) {
      const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
      const isAuth = request.originalUrl.includes('/auth/login');
      
      if (!isMutation && !isAuth) return next.handle();

      const user = request.user;
      const url = request.originalUrl;
      const endpoint = request.route?.path || url;
      const ipAddress = request.ip || request.connection?.remoteAddress;
      const userAgent = request.headers['user-agent'] || '';
      
      let action = 'READ';
      if (method === 'POST') action = 'CREATE';
      if (method === 'PUT' || method === 'PATCH') action = 'UPDATE';
      if (method === 'DELETE') action = 'DELETE';
      if (isAuth) action = 'LOGIN';

      const parts = url.split('?')[0].split('/');
      let resource = 'system';
      if (parts.length > 3) resource = parts[3];
      if (isAuth) resource = 'auth';

      const cleanBody = { ...request.body };
      if (cleanBody.password) delete cleanBody.password;
      if (cleanBody.newPassword) delete cleanBody.newPassword;
      if (cleanBody.confirmPassword) delete cleanBody.confirmPassword;

      const description = `User performed ${action} on ${resource}`;
      const logId = `AUD-${Math.floor(10000 + Math.random() * 90000)}`;
      
      let resourceId = null;
      if (['PUT', 'PATCH', 'DELETE'].includes(method) && parts.length > 4) {
         resourceId = parts[4];
      }

      const logData = {
        logId,
        userId: user?.userId || user?._id || null,
        userEmail: user?.email || cleanBody.email || 'anonymous',
        userRole: user?.role ? user.role.toLowerCase().replace('super_', '') : (request.originalUrl.includes('admin') ? 'admin' : 'user'),
        action,
        resource,
        resourceId,
        description,
        method,
        endpoint,
                userAgent,
              };

      return next.handle().pipe(
        tap(() => {
          this.auditLogsService.createLog({
            ...logData,
            status: 'SUCCESS',
          });
        }),
        catchError((error) => {
          this.auditLogsService.createLog({
            ...logData,
            status: 'ERROR',
            errorMessage: error.message || 'Internal Server Error',
          });
          return throwError(() => error);
        }),
      );
    }

    return next.handle();
  }
}
