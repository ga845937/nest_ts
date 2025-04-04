export const httpPort = process.env.HTTP_PORT;

export const basePath = process.env.BASE_PATH;

export const corsAllow = process.env.CORS_ALLOW.split(",");

export const logPath = process.env.LOG_PATH;

export const dbConfig = {
    database: process.env.DB_DATABASE,
    master  : {
        host    : process.env.DB_MASTER_HOST,
        password: process.env.DB_MASTER_PASSWORD,
        port    : Number(process.env.DB_MASTER_PORT),
        username: process.env.DB_MASTER_USERNAME,
    },
    slave: {
        host    : process.env.DB_SLAVE_HOST,
        password: process.env.DB_SLAVE_PASSWORD,
        port    : Number(process.env.DB_SLAVE_PORT),
        username: process.env.DB_SLAVE_USERNAME,
    },
};

export const redisURI = process.env.REDIS_URI;
