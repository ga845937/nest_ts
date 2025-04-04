import type { ILogBase, IVersion } from "@type/logger/logger.interface";
import type { Format, TransformableInfo } from "logform";

import { execSync } from "child_process";

import { name as projectName, version as projectVersion } from "@packageJson";
import { alsService } from "@utility/als";
import { format } from "winston";

export const version: IVersion = {
    branch: execSync("git branch --show-current", { encoding: "utf8" }).trim(),
    hash  : execSync("git log --pretty=format:%h -n 1", { encoding: "utf8" }).trim(),
    projectName,
    projectVersion,
};

export const formatTimestamp = format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
});

export const levelFilter = (level: string): Format => {
    return format((info: TransformableInfo) => {
        return info.level !== level ? false : info;
    })();
};

export const baseFormat = (info: TransformableInfo): ILogBase => {
    return {
        level    : info.level,
        message  : info.message as string,
        timestamp: info.timestamp as string,
        traceID  : alsService.getStore()?.traceID ?? "traceID",
        version,
    };
};
