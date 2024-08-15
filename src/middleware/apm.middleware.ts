import { Injectable, NestMiddleware } from "@nestjs/common";
import elasticApmNode from "elastic-apm-node";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class APMMiddleware implements NestMiddleware {
    constructor(private readonly elasticApm: elasticApmNode.Agent) {
    }

    public use = (request: Request, response: Response, next: NextFunction): void => {
        request.traceID = this.elasticApm.currentTransaction.ids["trace.id"];
        request.service = request.path.split("/")[2] || request.originalUrl.split("/")[2];
        request.clientIP = request.ip.replace("::ffff:", "");
        next();
    };

    public get elasticApmInstance(): elasticApmNode.Agent {
        return this.elasticApm;
    }
}
