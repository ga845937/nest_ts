import type { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import type { Request, Response } from "express";

import { LoggerInterceptor } from "@interceptor/logger.interceptor";
import { Catch, HttpStatus } from "@nestjs/common";
import { ErrorMessage } from "@type/error";

@Catch()
export class ProgramExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerInterceptor) { }

    public catch = (exception: Error, host: ArgumentsHost): void => {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        request.requestError = exception;

        const responseData = {
            traceID: this.logger.elasticApmInstance.currentTransaction.ids["trace.id"],
            message: ErrorMessage.ServerError,
        };

        this.logger.responseLog(request, response, responseData);

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseData);
    };
}
