import type { INestApplication } from "@nestjs/common";
import type { SwaggerCustomOptions, SwaggerDocumentOptions } from "@nestjs/swagger";

import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { description, name as projectName, version } from "@packageJson";
import { basePath } from "config";

export const initOpenAPI = (app: INestApplication): void => {
    const config = new DocumentBuilder()
        .setTitle(projectName)
        .setDescription(description)
        .setVersion(version)
        .addServer(basePath)
        .addBearerAuth()
        .addSecurityRequirements("bearer")
        .build();
    const documentOption: SwaggerDocumentOptions = {
        ignoreGlobalPrefix: true,
        operationIdFactory: (
            controllerKey: string,
            methodKey: string,
        ) => methodKey,
    };
    const document = SwaggerModule.createDocument(app, config, documentOption);
    const swaggerOption: SwaggerCustomOptions = {
        swaggerOptions: {
            displayRequestDuration: true, // 顯示請求時間
            persistAuthorization  : true, // 保留驗證(jwt 等等)的資訊
            showCommonExtensions  : true, // 是否顯示 keyword annotations (pattern, maxLength, minimum...)
            tryItOutEnabled       : true, // 去除 tryItOut 按鈕
        },
    };
    SwaggerModule.setup(`${basePath}/apiDoc`, app, document, swaggerOption);
};
