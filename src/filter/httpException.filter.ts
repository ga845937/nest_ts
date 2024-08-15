import type { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import type { Request, Response } from "express";

import { LoggerInterceptor } from "@interceptor/logger.interceptor";
import { Catch, HttpException, HttpStatus } from "@nestjs/common";
import { ErrorMessage } from "@type/error";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerInterceptor) { }

    public catch = (exception: unknown, host: ArgumentsHost): void => {
        console.error(exception);

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = ErrorMessage.ServerError as string;

        if (exception instanceof HttpException) {
            if (exception.cause) {
                request.requestError = exception.cause as Error;
            }
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse() as Record<string, string>;
            message = typeof exceptionResponse === "string" ? exceptionResponse : exceptionResponse.message.toString();
        }
        else {
            request.requestError = exception as Error;
        }

        const responseData = {
            traceID: request.traceID,
            message,
        };

        response.status(status);
        this.logger.responseLog(request, response, responseData);
        response.json(responseData);
    };
}
