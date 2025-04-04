import type { level } from "@enum/logger.enum";
import type { ILogFormat } from "@type/logger/format.interface";
import type { ILogWebSocket } from "@type/logger/logger.interface";
import type { Format, TransformableInfo } from "logform";
/* eslint-disable-next-line @typescript-eslint/naming-convention */
import type Transport from "winston-transport";

import { format, transports } from "winston";
/* eslint-disable-next-line @typescript-eslint/naming-convention */
import DailyRotateFile from "winston-daily-rotate-file";

import { baseFormat, formatTimestamp, levelFilter } from "./utility.format";

export class WebSocketLogFormat implements ILogFormat {
    public readonly level: keyof typeof level = "webSocket";

    private consoleFormat(): Format {
        return format.printf((info: TransformableInfo): string => {
            const log = baseFormat(info);
            const data = info.data as ILogWebSocket;
            const logString = `\x1b[36m${log.timestamp} [${log.level}] ${log.traceID} | ${data.event} | ${JSON.stringify(data.arg)} | ${JSON.stringify(data.responseData)} | ${data.duration}ms\x1b[0m`;
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
