import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

import { HttpExceptionFilter } from "./httpException.filter";

@Module({
    imports  : [],
    providers: [
        {
            provide : APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class FilterModule { }
