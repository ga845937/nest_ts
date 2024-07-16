import { httpPort } from "@env";
import { HttpExceptionFilter } from "@filter/httpException.filter";
import { LoggerInterceptor } from "@interceptor/logger.interceptor";
import { ResponseTransformInterceptor } from "@interceptor/responseTransform.interceptor";
import { NestFactory } from "@nestjs/core";
import { Validator } from "@pipe/validator.pipe";

import { MainModule } from "./main.module";

const main = async (): Promise<void> => {
    const app = await NestFactory.create(MainModule);
    app.getHttpAdapter().getInstance().disable("x-powered-by");
    app.useGlobalInterceptors(new LoggerInterceptor());
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new Validator());
    await app.listen(httpPort);
};

main();
