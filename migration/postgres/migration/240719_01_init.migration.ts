import type { QueryInterface } from "sequelize";

import { DataTypes } from "sequelize";

import { TableName, TypeName } from "../enum";

export const up = async({ context: queryInterface }: Record<string, QueryInterface>): Promise<void> => {
    await queryInterface.sequelize.query(`CREATE TYPE ${TypeName.USER_STATUS} AS ENUM ('INACTIVE', 'ACTIVE', 'RENT', 'BANNED');`);
    await queryInterface.createTable(TableName.USER, {
        email: {
            allowNull : false,
            comment   : "使用者email",
            primaryKey: true,
            type      : DataTypes.STRING(50),
        },
        name: {
            allowNull: false,
            comment  : "使用者名稱",
            type     : DataTypes.STRING(50),
        },
        status: {
            allowNull   : false,
            comment     : "使用者狀態",
            defaultValue: "INACTIVE",
            type        : TypeName.USER_STATUS,
        },
    });

    await queryInterface.sequelize.query(`CREATE TYPE ${TypeName.WALLET_STATUS} AS ENUM ('INACTIVE', 'ACTIVE', 'RENT', 'BANNED');`);
    await queryInterface.createTable(TableName.WALLET, {
        balance: {
            allowNull   : false,
            comment     : "錢包餘額",
            defaultValue: 0,
            type        : DataTypes.INTEGER,
        },
        id: {
            allowNull   : false,
            comment     : "錢包唯一辨識值",
            defaultValue: queryInterface.sequelize.literal("uuid_generate_v4()"),
            primaryKey  : true,
            type        : DataTypes.UUID,
        },
        status: {
            allowNull   : false,
            comment     : "錢包狀態",
            defaultValue: "INACTIVE",
            type        : TypeName.WALLET_STATUS,
        },
        userEmail: {
            allowNull : false,
            comment   : "使用者email",
            field     : "user_email",
            references: { key: "email", model: TableName.USER },
            type      : DataTypes.STRING(50),
            unique    : true,
        },
    });

    await queryInterface.createTable(TableName.HISTORY, {
        balance: {
            allowNull: false,
            comment  : "錢包餘額",
            type     : DataTypes.INTEGER,
        },
        createTime: {
            allowNull   : false,
            comment     : "交易資料建立時間",
            defaultValue: queryInterface.sequelize.literal("FLOOR(EXTRACT(epoch FROM now())) * (1000)"),
            field       : "create_time",
            type        : DataTypes.BIGINT,
        },
        description: {
            allowNull: true,
            comment  : "描述",
            type     : DataTypes.STRING(20),
        },
        id: {
            allowNull   : false,
            comment     : "交易紀錄唯一辨識值",
            defaultValue: queryInterface.sequelize.literal("uuid_generate_v4()"),
            primaryKey  : true,
            type        : DataTypes.UUID,
        },
        transactionAmount: {
            allowNull: false,
            comment  : "交易金額",
            field    : "transaction_amount",
            type     : DataTypes.INTEGER,
        },
        userEmail: {
            allowNull : false,
            comment   : "使用者email",
            field     : "user_email",
            references: { key: "email", model: TableName.USER },
            type      : DataTypes.STRING(50),
        },
        walletID: {
            allowNull : false,
            comment   : "錢包唯一辨識值",
            field     : "wallet_id",
            references: { key: "id", model: TableName.WALLET },
            type      : DataTypes.STRING(10),
        },
    });
};

export const down = async({ context: queryInterface }: Record<string, QueryInterface>): Promise<void> => {
    await queryInterface.dropTable(TableName.USER);
    await queryInterface.dropTable(TableName.WALLET);
    await queryInterface.dropTable(TableName.HISTORY);

    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS ${TypeName.USER_STATUS};`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS ${TypeName.WALLET_STATUS};`);
};
