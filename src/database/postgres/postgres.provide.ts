import type { ILogSQL } from "@type/logger/logger.interface";

import { PostgresDatabase } from "@database/enum/postgres/database.enum";
import { logger } from "@utility/logger/logger";
import { dbConfig } from "config";
import { QueryTypes, Sequelize } from "sequelize";

import { initModels } from "./entity/init-models";

export const postgresProvider = [
    {
        provide   : PostgresDatabase.NODEJS,
        useFactory: (): ReturnType<typeof initModels> => {
            const sequelizeOption = new Sequelize({
                database: dbConfig.database,
                dialect : "postgres",
                logging : (sql: string, duration?: number, option?: Record<string, unknown>): void => {
                    const logData: ILogSQL = {
                        database: PostgresDatabase.NODEJS,
                        duration,
                        sql,
                        type    : option?.type === QueryTypes.SELECT ? "slave" : "master",
                    };

                    logger.sql(logData);
                },
                pool: {
                    idle: 30000,
                    max : 20,
                },
                replication: {
                    read: [
                        {
                            host    : dbConfig.slave.host,
                            password: dbConfig.slave.password,
                            username: dbConfig.slave.username,
                        },
                    ],
                    write: {
                        host    : dbConfig.master.host,
                        password: dbConfig.master.password,
                        username: dbConfig.master.username,
                    },
                },
            });
            return initModels(sequelizeOption);
        },
    },
    /* other database
    {

    }
    */
];
