import type { level } from "@enum/logger.enum";
import type { ILogFormat } from "@type/logger/format.interface";
import type { ILogAPI } from "@type/logger/logger.interface";
import type { Format, TransformableInfo } from "logform";
/* eslint-disable-next-line @typescript-eslint/naming-convention */
import type Transport from "winston-transport";

import { format, transports } from "winston";
/* eslint-disable-next-line @typescript-eslint/naming-convention */
import DailyRotateFile from "winston-daily-rotate-file";

import { baseFormat, formatTimestamp, levelFilter } from "./utility.format";

export class APILogFormat implements ILogFormat {
    public readonly level: keyof typeof level = "api";

    private consoleFormat(): Format {
        return format.printf((info: TransformableInfo): string => {
            const log = baseFormat(info);
            const data = info.data as ILogAPI;
            const logString = `\x1b[32m${log.timestamp} [${log.level}] ${log.traceID} | [[${data.method}] ${data.uri}] | {[${data.httpStatus}]} ${JSON.stringify(data.response.data)} | ${data.duration}ms\x1b[0m`;
            return logString;
        });
    }

    private fileFormat(): Format {
        return format.printf((info: TransformableInfo): string => JSON.stringify(Object.assign(baseFormat(info), info.data)));
    }

    public consoleTransport(): Transport {
        return new transports.Console({
            debugStdout : true,
            forceConsole: true,
            format      : format.combine(
                levelFilter(this.level),
                formatTimestamp,
                this.consoleFormat(),
            ),
        });
    }

    public fileTransport(): Transport {
        return new DailyRotateFile({
            datePattern  : "YYYY-MM-DD",
            filename     : `log/%DATE%/${this.level}-%DATE%.json`,
            json         : true,
            maxFiles     : "3d",
            zippedArchive: true,
            format       : format.combine(
                levelFilter(this.level),
                formatTimestamp,
                format.json(),
                this.fileFormat(),
            ),
        });
    }
}
