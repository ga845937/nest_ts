import type { Rent, RentId } from "./rent";
import type * as Sequelize from "sequelize";
import type { Optional } from "sequelize";

import { DataTypes, Model } from "sequelize";

export interface UserAttributes {
    email: string,
    name: string,
    status: "ACTIVE" | "BANNED" | "INACTIVE" | "RENT",
}

export type UserPk = "email";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "status";
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    addRent!: Sequelize.HasManyAddAssociationMixin<Rent, RentId>;
    addRents!: Sequelize.HasManyAddAssociationsMixin<Rent, RentId>;
    countRents!: Sequelize.HasManyCountAssociationsMixin;

    createRent!: Sequelize.HasManyCreateAssociationMixin<Rent>;
    email!: string;
    getRents!: Sequelize.HasManyGetAssociationsMixin<Rent>;
    hasRent!: Sequelize.HasManyHasAssociationMixin<Rent, RentId>;
    hasRents!: Sequelize.HasManyHasAssociationsMixin<Rent, RentId>;
    name!: string;
    removeRent!: Sequelize.HasManyRemoveAssociationMixin<Rent, RentId>;
    removeRents!: Sequelize.HasManyRemoveAssociationsMixin<Rent, RentId>;
    // User hasMany Rent via userEmail
    rents!: Rent[];
    setRents!: Sequelize.HasManySetAssociationsMixin<Rent, RentId>;
    status!: "ACTIVE" | "BANNED" | "INACTIVE" | "RENT";

    static initModel(sequelize: Sequelize.Sequelize): typeof User {
        return sequelize.define("User", {
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
                type        : DataTypes.ENUM("INACTIVE", "ACTIVE", "RENT", "BANNED"),
            },
        }, {
            schema    : "public",
            tableName : "user",
            timestamps: false,
            indexes   : [
                {
                    name  : "user_pkey",
                    unique: true,
                    fields: [
                        { name: "email" },
                    ],
                },
            ],
        }) as typeof User;
    }
}
