import type { level } from "@enum/logger.enum";
/* eslint-disable-next-line @typescript-eslint/naming-convention */
import type Transport from "winston-transport";

export abstract class ILogFormat {
    public abstract readonly level: keyof typeof level;
    public abstract consoleTransport(): Transport;
    public abstract fileTransport(): Transport;
}
