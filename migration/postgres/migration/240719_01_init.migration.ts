import type { QueryInterface } from "sequelize";

import { DataTypes } from "sequelize";

import { TableName, TypeName } from "../enum";

export const up = async ({ context: queryInterface }: Record<string, QueryInterface>): Promise<void> => {
    await queryInterface.sequelize.query(`CREATE TYPE ${TypeName.UserStatus} AS ENUM ('INACTIVE', 'ACTIVE', 'RENT', 'BANNED');`);
    await queryInterface.createTable(TableName.User, {
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            primaryKey: true,
            comment: "使用者email",
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: "使用者名稱",
        },
        status: {
            type: TypeName.UserStatus,
            defaultValue: "INACTIVE",
            allowNull: false,
            comment: "使用者狀態",
        },
    });

    await queryInterface.sequelize.query(`CREATE TYPE ${TypeName.WalletStatus} AS ENUM ('INACTIVE', 'ACTIVE', 'RENT', 'BANNED');`);
    await queryInterface.createTable(TableName.Wallet, {
        id: {
            type: DataTypes.UUID,
            defaultValue: queryInterface.sequelize.literal("uuid_generate_v4()"),
            allowNull: false,
            primaryKey: true,
            comment: "錢包唯一辨識值",
        },
        userEmail: {
            type: DataTypes.STRING(50),
            allowNull: false,
            references: { model: TableName.User, key: "email" },
            comment: "使用者email",
            field: "user_email",
            unique: true,
        },
        status: {
            type: TypeName.WalletStatus,
            defaultValue: "INACTIVE",
            allowNull: false,
            comment: "錢包狀態",
        },
        balance: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: "錢包餘額",
        },
    });

    await queryInterface.createTable(TableName.History, {
        id: {
            type: DataTypes.UUID,
            defaultValue: queryInterface.sequelize.literal("uuid_generate_v4()"),
            allowNull: false,
            primaryKey: true,
            comment: "交易紀錄唯一辨識值",
        },
        userEmail: {
            type: DataTypes.STRING(50),
            allowNull: false,
            references: { model: TableName.User, key: "email" },
            comment: "使用者email",
            field: "user_email",
        },
        walletID: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: { model: TableName.Wallet, key: "id" },
            comment: "錢包唯一辨識值",
            field: "wallet_id",
        },
        transactionAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "交易金額",
            field: "transaction_amount",
        },
        balance: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "錢包餘額",
        },
        description: {
            type: DataTypes.STRING(20),
            allowNull: true,
            comment: "描述",
        },
        createTime: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: queryInterface.sequelize.literal("FLOOR(EXTRACT(epoch FROM now())) * (1000)"),
            field: "create_time",
            comment: "交易資料建立時間",
        }
    });
};

export const down = async ({ context: queryInterface }: Record<string, QueryInterface>): Promise<void> => {
    await queryInterface.dropTable(TableName.User);
    await queryInterface.dropTable(TableName.Wallet);
    await queryInterface.dropTable(TableName.History);

    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS ${TypeName.UserStatus};`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS ${TypeName.WalletStatus};`);
};
