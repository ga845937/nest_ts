import { nodeEnv, dbConfig } from "@env";
import { Sequelize } from "sequelize";
import { PostgresDatabase } from "type/db";

import { initModels } from "./entity/init-models";

export const postgresProvider = [
    {
        provide: PostgresDatabase.NODEJS,
        useFactory: (): ReturnType<typeof initModels> => {
            const sequelizeOption = new Sequelize({
                dialect: "postgres",
                host: dbConfig.host,
                port: dbConfig.port,
                username: dbConfig.username,
                password: dbConfig.password,
                database: dbConfig.database,
                logging: nodeEnv === "dev" ? true : false,
            });
            return initModels(sequelizeOption);
        },
    },
    /* other database
    {

    }
    */
];
