import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: any) => {
        return throwError(() => this.errorHandler(err, context));
      }),
    );
  }

  errorHandler(exception: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const validation: { message: string[]; error: string; statusCode: number } =
      exception.getResponse
        ? (exception.getResponse() as {
            message: string[];
            error: string;
            statusCode: number;
          })
        : { message: [], error: 'Not found', statusCode: 404 };

    delete validation.error;
    delete validation.statusCode;

    console.log(validation.message);

    // logging in console
    this.logger.error(
      `${request.method} ${request.originalUrl} ${status} ${validation.message}`,
    );

    console.log(exception);
    response.status(status).json({
      status: false,
      statusCode: status,
      path: request.url,
      message: exception.message,
      result: validation ? validation : [],
    });
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = response.statusCode;
    const { message, ...remainingRes } = res;

    // logging in console
    this.logger.log(`${request.method} ${request.originalUrl} ${statusCode}`);

    response.status(statusCode).json({
      status: true,
      path: request.url,
      statusCode,
      message: message ?? 'Success',
      result: remainingRes,
    });
  }
}
