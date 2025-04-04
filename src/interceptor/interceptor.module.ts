import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { ALSInterceptor } from "./als.interceptor";
import { LoggerInterceptor } from "./logger.interceptor";
import { ResponseTransformInterceptor } from "./responseTransform.interceptor";

@Module({
    imports  : [],
    providers: [
        {
            provide : APP_INTERCEPTOR,
            useClass: ALSInterceptor,
        },
        {
            provide : APP_INTERCEPTOR,
            useClass: LoggerInterceptor,
        },
        {
            provide : APP_INTERCEPTOR,
            useClass: ResponseTransformInterceptor,
        },
    ],
})
export class InterceptorModule { }
