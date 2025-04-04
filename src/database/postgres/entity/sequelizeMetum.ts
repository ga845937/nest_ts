import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface SequelizeMetumAttributes {
    name: string;
}

export type SequelizeMetumPk = "name";
export type SequelizeMetumId = SequelizeMetum[SequelizeMetumPk];
export type SequelizeMetumCreationAttributes = SequelizeMetumAttributes;

export class SequelizeMetum extends Model<SequelizeMetumAttributes, SequelizeMetumCreationAttributes> implements SequelizeMetumAttributes {
    name!: string;


    static initModel(sequelize: Sequelize.Sequelize): typeof SequelizeMetum {
        return sequelize.define('SequelizeMetum', {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true
        }
    }, {
        tableName: 'SequelizeMeta',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "SequelizeMeta_pkey",
                unique: true,
                fields: [
                    { name: "name" },
                ]
            },
        ]
    }) as typeof SequelizeMetum;
    }
}
