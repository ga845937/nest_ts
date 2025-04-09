import type { NextFunction, Request, Response } from "express";

import { alsService } from "@utility/index";

export const alsMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    alsService.run(() => {
        next();
    });
};
