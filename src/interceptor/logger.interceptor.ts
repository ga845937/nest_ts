import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import type { ILogHTTP } from "@type/logger/logger.interface";
import type { Request, Response } from "express";

import { Injectable } from "@nestjs/common";
import { alsService, logger } from "@utility/index";
import { Observable, Subscriber } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    public intercept = (context: ExecutionContext, next: CallHandler): Observable<unknown> => {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();

        return new Observable((observer: Subscriber<unknown>) => {
            next.handle().pipe(
                tap((data: Record<string, unknown>) => {
                    const alsData = alsService.getStore();
                    const response = ctx.getResponse<Response>();

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
                            data,
                            header: response.getHeaders(),
                        },
                    };
                    logger.http(logData);
                }),
            ).subscribe(observer);
        });
    };
}
