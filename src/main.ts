import { NestFactory } from "@nestjs/core";
import { Validator } from "@pipe/validator.pipe";
import { basePath, corsAllow, httpPort } from "config";
import helmet from "helmet";

import { MainModule } from "./main.module";
import { initOpenAPI } from "./openAPI.module";

const main = async(): Promise<void> => {
    try {
        const cors = {
            credentials: true,
            origin     : (origin: string, callback: (error: Error | null, allow?: boolean) => void): void => {
                if (corsAllow.includes(origin) || !origin) {
                    callback(null, true);
                }
                else {
                    callback(null, false);
                }
            },
        };

        const app = await NestFactory.create(MainModule, { cors });
        app.setGlobalPrefix(basePath);
        app.getHttpAdapter().getInstance().disable("x-powered-by");

        app.useGlobalPipes(new Validator());

        initOpenAPI(app);

        app.use(helmet());
        await app.listen(httpPort);
    }
    catch (error) {
        console.error(error);
    }
};

main();
