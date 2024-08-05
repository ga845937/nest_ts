import type { INestApplication } from "@nestjs/common";
import type { SwaggerDocumentOptions, SwaggerCustomOptions } from "@nestjs/swagger";

import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { name as projectName, description, version } from "@packageJson";

export const initOpenAPI = (app: INestApplication): void => {
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
};
