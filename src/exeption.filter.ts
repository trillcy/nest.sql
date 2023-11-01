import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    // ------

    let responseErrors: any = { errorsMessages: [] };
    const responseBody: any = exception.getResponse();
    console.log('20++filter', status);

    switch (status) {
      case 400:
        responseBody.message.forEach((el: string) =>
          responseErrors.errorsMessages.push(el),
        );
        response.status(status).json(responseErrors);
        break;
      default:
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    }
  }
}
