import type { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import type { Request, Response } from "express";
import type { TransformableInfo } from "logform";
import type { Observable } from "rxjs";
import type { Logger } from "winston";

import { join } from "path";

import { logPath, nodeEnv } from "@env";
import { Injectable } from "@nestjs/common";
import { name as projectName } from "@packageJson";
import elasticApmNode from "elastic-apm-node";
import { tap } from "rxjs/operators";
import winston from "winston";
/* eslint-disable-next-line @typescript-eslint/naming-convention */
import DailyRotateFile from "winston-daily-rotate-file";

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
    // version: IVersion,
    debugInfo?: unknown,
}

interface IRequestLogData extends ILogData {
    requestHeader: Record<string, unknown>,
    requestQuery?: Record<string, unknown>,
    requestBody?: unknown,
}

interface IResponseLogData extends ILogData {
    httpStatus: number,
    responseHeader: Record<string, unknown>,
    responseData: Record<string, unknown>,
    error?: Record<string, unknown>,
}

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    private readonly logger: Logger;

    constructor(private readonly elasticApm: elasticApmNode.Agent) {
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
        this.requestLog(request);

        return next
            .handle()
            .pipe(
                tap((responseData: Record<string, unknown>) => {
                    const response = ctx.getResponse<Response>();
                    this.responseLog(request, response, responseData);
                }),
            );
    };

    private createBaseLogData(req: Request): ILogData {
        return {
            program: "nodejs",
            project: projectName,
            env: nodeEnv,
            service: req.service,
            traceID: req.traceID,
            clientIP: req.clientIP,
            requestMethod: req.method,
            requestURI: req.originalUrl,
            time: +new Date(),
            // version
        };
    }

    private errorToJson = (error: Error): Record<string, unknown> => {
        const stack = error.stack.split("\n").map((x: string) => x.trim());
        stack.shift();
        return {
            name: error.name,
            message: error.message,
            stack
        };
    };

    public get loggerInstance(): Logger {
        return this.logger;
    }

    public get elasticApmInstance(): elasticApmNode.Agent {
        return this.elasticApm;
    }

    public requestLog = (request: Request): void => {
        request.traceID = this.elasticApm.currentTransaction.ids["trace.id"];
        request.service = request.path.split("/")[1];
        request.clientIP = request.ip.replace("::ffff:", "");

        const reqLogData: IRequestLogData = {
            ...this.createBaseLogData(request),
            requestHeader: request.headers,
            requestQuery: request.query || {},
            requestBody: request.body || {}
        };

        this.logger.info(reqLogData);
    };

    public responseLog = (request: Request, response: Response, responseData: Record<string, unknown>): void => {
        const resLogData: IResponseLogData = {
            ...this.createBaseLogData(request),
            httpStatus: response.statusCode,
            responseHeader: response.getHeaders(),
            responseData
        };

        if (request.requestError) {
            resLogData.error = this.errorToJson(request.requestError);
        }
        if (request.debugInfo) {
            resLogData.debugInfo = request.debugInfo instanceof Error ? this.errorToJson(request.debugInfo) : request.debugInfo;
        }

        this.logger.info(resLogData);
    };
}
