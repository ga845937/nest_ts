import type { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import type { Request, Response } from "express";
import type { TransformableInfo } from "logform";
import type { Observable } from "rxjs";
import type { Logger } from "winston";

import { join } from "path";

import { logPath, nodeEnv } from "@env";
import { Injectable } from "@nestjs/common";
import { name as projectName } from "@packageJson";
import { tap } from "rxjs/operators";
import winston from "winston";
/* eslint-disable-next-line @typescript-eslint/naming-convention */
import DailyRotateFile from "winston-daily-rotate-file";

interface IVersion {
    projectName: string,
    projectVersion: string,
    branch: string,
    hash: string,
    subModule?: Record<string, IVersion>,
}

interface ILogData {
    program: string,
    project: string,
    env: string,
    service: string,
    traceID: string,
    clientIP: string,
    requestMethod: string,
    requestURI: string,
    time: number,
    //version: IVersion,
    debugInfo?: unknown,
    requestHeader: Record<string, unknown>,
    requestQuery?: Record<string, unknown>,
    requestParam?: Record<string, unknown>,
    requestBody?: unknown,
    httpStatus: number,
    responseHeader: Record<string, unknown>,
    responseData: Record<string, unknown>,
    error?: Record<string, unknown>,
}

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    private readonly logger: Logger;

    constructor() {
        this.logger = winston.createLogger({
            transports: [
                new DailyRotateFile({
                    format: winston.format.printf((info: TransformableInfo) => JSON.stringify(info.message)),
                    filename: join(logPath, `${projectName}-%DATE%.json`),
                    datePattern: "YYYY-MM-DD",
                    zippedArchive: true,
                    maxFiles: "3d",
                }),
            ],
        });
    }

    public intercept = (context: ExecutionContext, next: CallHandler): Observable<unknown> => {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();

        return next.handle().pipe(
            tap((responseData: unknown) => {
                const response = ctx.getResponse<Response>();

                if (typeof responseData !== "object" || Array.isArray(responseData) ||
                    responseData === null || responseData === undefined) {
                    responseData = {
                        traceID: request.traceID,
                        data: responseData
                    };
                }
                this.responseLog(request, response, responseData as Record<string, unknown>);
            }),
        );
    };

    private errorToJson = (error: Error): Record<string, unknown> => {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
        };
    };

    public get loggerInstance(): Logger {
        return this.logger;
    }

    public responseLog = (request: Request, response: Response, responseData: Record<string, unknown>): void => {
        const responseLog: ILogData = {
            program: "nodejs",
            project: projectName,
            env: nodeEnv,
            service: request.service,
            traceID: request.traceID,
            clientIP: request.clientIP,
            requestMethod: request.method,
            requestURI: request.originalUrl,
            time: +new Date(),
            //version,
            requestHeader: request.headers,
            requestQuery: request.query || {},
            requestParam: request.params || {},
            requestBody: request.body || {},
            httpStatus: response.statusCode,
            responseHeader: response.getHeaders(),
            responseData
        };

        if (request.requestError) {
            responseLog.error = this.errorToJson(request.requestError);
        }

        this.logger.info(responseLog);
    };
}
