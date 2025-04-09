import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import type { ILogHTTP } from "@type/logger/logger.interface";
import type { Request, Response } from "express";

import { ErrorMessage } from "@enum/error.enum";
import { Catch, HttpException, HttpStatus } from "@nestjs/common";
import { alsService, logger } from "@utility/index";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    public catch = (exception: unknown, host: ArgumentsHost): void => {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        response.status(HttpStatus.INTERNAL_SERVER_ERROR);
        let message = ErrorMessage.SERVER_ERROR as string;

        if (exception instanceof HttpException) {
            response.status(exception.getStatus());
            const exceptionResponse = exception.getResponse() as Record<string, string>;
            message = typeof exceptionResponse === "string" ? exceptionResponse : exceptionResponse.message.toString();
        }
        logger.error(exception as Error);

        const alsData = alsService.getStore();

        const responseData = {
            message,
            traceID: alsData.traceID,
        };

        const logData: ILogHTTP = {
            baseUrl   : request.baseUrl,
            duration  : +Date.now() - alsData.timestamp,
            httpStatus: response.statusCode,
            method    : request.method,
            path      : request.path,
            uri       : request.originalUrl,
            request   : {
                body  : request.body,
                header: request.headers,
                param : request.params,
                query : request.query,
            },
            response: {
                data  : responseData,
                header: response.getHeaders(),
            },
        };
        logger.http(logData);

        response.json(responseData);
    };
}
