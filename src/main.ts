import { httpPort } from "@env";
import { corsAllow, basePath, nodeEnv, apmServerURL as serverUrl } from "@env";
import { HttpExceptionFilter } from "@filter/httpException.filter";
import { AuthorizationGuard } from "@guard/authorization.guard";
import { LoggerInterceptor } from "@interceptor/logger.interceptor";
import { ResponseTransformInterceptor } from "@interceptor/responseTransform.interceptor";
import { APMMiddleware } from "@middleware/apm.middleware";
import { NestFactory } from "@nestjs/core";
import { name as serviceName } from "@packageJson";
import { Validator } from "@pipe/validator.pipe";
import elasticApmNode from "elastic-apm-node";
import helmet from "helmet";

import { MainModule } from "./main.module";
import { initOpenAPI } from "./openAPI.module";

const main = async (): Promise<void> => {
    const elasticApm = elasticApmNode.start({
        serviceName,
        serverUrl,
        environment: nodeEnv
    });

    const cors = {
        origin: (origin: string, callback: (error: Error | null, allow?: boolean) => void): void => {
            if (corsAllow.includes(origin) || !origin) {
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        },
        credentials: true
    };
    const app = await NestFactory.create(MainModule, { cors });
    app.setGlobalPrefix(basePath);
    app.getHttpAdapter().getInstance().disable("x-powered-by");

    const apmMiddleware = new APMMiddleware(elasticApm);
    app.use(apmMiddleware.use);
    const logger = new LoggerInterceptor();
    app.useGlobalInterceptors(logger, new ResponseTransformInterceptor());
    app.useGlobalGuards(new AuthorizationGuard());
    app.useGlobalPipes(new Validator());
    app.useGlobalFilters(new HttpExceptionFilter(logger));

    if (nodeEnv === "dev") {
        initOpenAPI(app);
    }

    app.use(helmet());
    await app.listen(httpPort);
};

main();
