import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let errors: string[] = [];

    if (exception instanceof HttpException) {
      const responseData = exception.getResponse();
      if (typeof responseData === 'object' && responseData !== null) {
        message = (responseData as any).message || message;
        if (Array.isArray((responseData as any).message)) {
          errors = (responseData as any).message;
          message = 'Validation failed';
        } else if ((responseData as any).error) {
          errors = [(responseData as any).error];
        }
      } else if (typeof responseData === 'string') {
        message = responseData;
      }
    } else if (exception instanceof Error) {
      // In production, you might not want to expose raw error messages
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      message,
      errors: errors.length > 0 ? errors : undefined,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
