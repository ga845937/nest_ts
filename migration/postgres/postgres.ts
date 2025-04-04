import { dbConfig } from "config";
import { Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";

const sequelize = new Sequelize({
    database: dbConfig.database,
    dialect : "postgres",
    host    : dbConfig.master.host,
    password: dbConfig.master.password,
    port    : dbConfig.master.port,
    username: dbConfig.master.username,
});

const migrator = new Umzug({
    context   : sequelize.getQueryInterface(),
    logger    : console,
    storage   : new SequelizeStorage({ sequelize }),
    migrations: {
        glob: ["migration/*.migration.ts", { cwd: __dirname }],
    },
});

const seeder = new Umzug({
    context   : sequelize.getQueryInterface(),
    logger    : console,
    storage   : new SequelizeStorage({ sequelize }),
    migrations: {
        glob: ["seed/*.seed.ts", { cwd: __dirname }],
    },
});

const init = async(): Promise<void> => {
    await migrator.up();
    await seeder.up();
};

init();
