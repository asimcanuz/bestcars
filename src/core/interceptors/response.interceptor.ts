import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Response } from './response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data: any) => this.responseHandler(data, context)),
      catchError((error: HttpException) =>
        throwError(() => this.errorHandler(error, context)),
      ),
    );
  }

  errorHandler(
    exception: HttpException,
    context: ExecutionContext,
  ): HttpException {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message || 'Internal server error';


    return new HttpException({
      status: false,
      statusCode: status,
      message,
      result: null,
    }, status);
    
  }

  responseHandler(res: any, context: ExecutionContext): Response<T> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const status = response.statusCode;

    return {
      status: true,
      statusCode: status,
      message: 'Success',
      result: res,
      timestamp: new Date().toISOString(),
    };
  }
}
