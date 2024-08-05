import { httpPort } from "@env";
import { nodeEnv, apmServerURL as serverUrl } from "@env";
import { HttpExceptionFilter } from "@filter/httpException.filter";
import { AuthorizationGuard } from "@guard/authorization.guard";
import { LoggerInterceptor } from "@interceptor/logger.interceptor";
import { ResponseTransformInterceptor } from "@interceptor/responseTransform.interceptor";
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

    const app = await NestFactory.create(MainModule);
    app.getHttpAdapter().getInstance().disable("x-powered-by");
    const logger = new LoggerInterceptor(elasticApm);
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
