import type { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import type { Request, Response } from "express";

import { LoggerInterceptor } from "@interceptor/logger.interceptor";
import { Catch, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerInterceptor) { }

    public catch = (exception: HttpException, host: ArgumentsHost): void => {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const responseData = {
            traceID: request.traceID,
            message: exception.getResponse(),
        };

        this.logger.responseLog(request, response, responseData);

        response
            .status(status)
            .json(responseData);
    };
}
