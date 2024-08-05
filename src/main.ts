import type { SwaggerDocumentOptions, SwaggerCustomOptions } from "@nestjs/swagger";

import { httpPort } from "@env";
import { nodeEnv, apmServerURL as serverUrl } from "@env";
import { HttpExceptionFilter } from "@filter/httpException.filter";
import { AuthorizationGuard } from "@guard/authorization.guard";
import { LoggerInterceptor } from "@interceptor/logger.interceptor";
import { ResponseTransformInterceptor } from "@interceptor/responseTransform.interceptor";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { name as serviceName } from "@packageJson";
import { name as projectName, description, version } from "@packageJson";
import { Validator } from "@pipe/validator.pipe";
import elasticApmNode from "elastic-apm-node";
import helmet from "helmet";

import { MainModule } from "./main.module";

const main = async (): Promise<void> => {
    const elasticApm = elasticApmNode.start({
        serviceName,
        serverUrl,
        environment: nodeEnv
    });

    const app = await NestFactory.create(MainModule);
    // app.use(helmet());
    app.getHttpAdapter().getInstance().disable("x-powered-by");
    const logger = new LoggerInterceptor(elasticApm);
    app.useGlobalInterceptors(logger, new ResponseTransformInterceptor());
    app.useGlobalGuards(new AuthorizationGuard());
    app.useGlobalPipes(new Validator());
    app.useGlobalFilters(new HttpExceptionFilter(logger));

    const config = new DocumentBuilder()
        .setTitle(projectName)
        .setDescription(description)
        .setVersion(version)
        .addApiKey({ type: "apiKey", name: "x-access-token", in: "header" }, "Api-Key")
        .build();
    const documentOption: SwaggerDocumentOptions = {
        operationIdFactory: (
            controllerKey: string,
            methodKey: string
        ) => methodKey,
    };
    const document = SwaggerModule.createDocument(app, config, documentOption);
    const swaggerOption: SwaggerCustomOptions = {
        swaggerOptions: {
            tryItOutEnabled: true, // 去除 tryItOut 按鈕
            showCommonExtensions: true, // 是否顯示 keyword annotations (pattern, maxLength, minimum...)
            persistAuthorization: true, // 保留驗證(jwt 等等)的資訊
            displayRequestDuration: true // 顯示請求時間
        }
    };
    SwaggerModule.setup("apiDoc", app, document, swaggerOption);

    app.use(helmet());
    await app.listen(httpPort);
};

main();
