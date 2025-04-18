import type { ILogFormat } from "@type/logger/format.interface";
import type { ILogAPI, ILogGRPC, ILogHTTP, ILogSQL, ILogWebSocket } from "@type/logger/logger.interface";
import type { LoggerOptions, Logger as WinstonLogger } from "winston";

import { ErrorMessage } from "@enum/error.enum";
import { level } from "@enum/logger.enum";
import { HttpException, InternalServerErrorException } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { createLogger } from "winston";

import { APILogFormat } from "./format/api.format";
import { ErrorLogFormat } from "./format/error.format";
import { GRPCLogFormat } from "./format/grpc.format";
import { HTTPLogFormat } from "./format/http.format";
import { InfoLogFormat } from "./format/info.format";
import { SQLLogFormat } from "./format/sql.format";
import { WebSocketLogFormat } from "./format/webSocket.format";

class Logger {
    private readonly logger: WinstonLogger;

    constructor() {
        const logFormat: ILogFormat[] = [
            new APILogFormat(),
            new ErrorLogFormat(),
            new GRPCLogFormat(),
            new HTTPLogFormat(),
            new InfoLogFormat(),
            new SQLLogFormat(),
            new WebSocketLogFormat(),
        ];

        const transports = logFormat.map((format: ILogFormat) => [format.fileTransport(), format.consoleTransport()]).flat();
        const option: LoggerOptions = {
            level : "debug",
            levels: level,
            transports,
        };

        this.logger = createLogger(option);
    }

    public api(data: ILogAPI): void {
        this.logger.log({
            data,
            level  : "api",
            message: "api",
        });
    }

    public error(error: Error): void {
        if (error instanceof HttpException) {
            this.logger.log({
                level  : "error",
                message: error.message,
                data   : {
                    cause: error.cause,
                    error: error,
                },
            });
            return;
        }

        if (error instanceof WsException) {
            this.logger.error({
                level  : "error",
                message: error.message,
                data   : {
                    cause: error.cause,
                    error: error,
                },
            });
            return;
        }

        const showError = new InternalServerErrorException(ErrorMessage.SERVER_ERROR);
        this.logger.log({
            level  : "error",
            message: error.message,
            data   : {
                cause: error,
                error: showError,
            },
        });
    }

    public grpc(data: ILogGRPC): void {
        this.logger.log({
            data,
            level  : "grpc",
            message: "grpc",
        });
    }

    public http(data: ILogHTTP): void {
        this.logger.log({
            data,
            level  : "http",
            message: "http",
        });
    }

    public info(message: string): void {
        this.logger.info(message);
    }

    public sql(data: ILogSQL): void {
        this.logger.log({
            data,
            level  : "sql",
            message: "sql",
        });
    }

    public webSocket(data: ILogWebSocket): void {
        this.logger.log({
            data,
            level  : "webSocket",
            message: "webSocket",
        });
    }
}

export const logger = new Logger();
