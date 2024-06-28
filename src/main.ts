import type { ValidationError } from "@nestjs/common";

import { httpPort } from "@env";
import { HttpExceptionFilter } from "@filter/httpException";
import { LoggerInterceptor } from "@interceptor/logger";
import { ResponseTransformInterceptor } from "@interceptor/responseTransform";
import { MainModule } from "@modules/main";
import { ValidationPipe, HttpException, HttpStatus } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

const getAllConstraints = (errors: ValidationError[]): string[] => {
    const constraints: string[] = [];

    for (const error of errors) {
        if (error.constraints) {
            const constraintValues = Object.values(error.constraints);
            constraints.push(...constraintValues);
        }

        if (error.children) {
            const childConstraints = getAllConstraints(error.children);
            constraints.push(...childConstraints);
        }
    }

    return constraints;
};

const main = async (): Promise<void> => {
    const app = await NestFactory.create(MainModule);
    app.getHttpAdapter().getInstance().disable("x-powered-by");
    app.useGlobalInterceptors(new LoggerInterceptor());
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new ValidationPipe({
        exceptionFactory: (errors: ValidationError[]) => new HttpException(getAllConstraints(errors), HttpStatus.UNPROCESSABLE_ENTITY),
    }));
    await app.listen(httpPort);
};

main();
