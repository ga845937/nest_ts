import type { AutoOptions } from "sequelize-auto";

import { SequelizeAuto } from "sequelize-auto";

import { dbConfig } from "../src/env";

const option: AutoOptions = {
    caseFile   : "c", // file names created for each model use camelCase.js not snake_case.js
    caseModel  : "p", // convert snake_case column names to camelCase field names: user_id -> userId
    caseProp   : "c", // convert snake_case column names to camelCase field names: user_id -> userId
    dialect    : "postgres",
    directory  : "./src/db/postgres/entity", // where to write files
    host       : dbConfig.host,
    indentation: 4,
    lang       : "ts", // the lang of the generated models
    port       : dbConfig.port,
    singularize: true, // convert plural table names to singular model names
    skipTables : ["SequelizeMeta"], // don't generate models for these tables
    useDefine  : true, // use Object.defineProperty for each property
    additional : {
        timestamps: false, // don't add timestamps fields (createdAt, updatedAt)
    },
};

const auto = new SequelizeAuto(dbConfig.database, dbConfig.username, dbConfig.password, option);

auto.run();
