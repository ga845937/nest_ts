import type { QueryInterface } from "sequelize";

import { TableName } from "../enum";

export const up = async ({ context: queryInterface }: Record<string, QueryInterface>): Promise<void> => {
    await queryInterface.bulkInsert(TableName.User, [
        {
            email: "kuo@example.com",
            name: "kuo",
        },
        {
            email: "jay@example.com",
            name: "jay",
        },
    ]);

    await queryInterface.bulkInsert(TableName.Wallet, [
        {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            user_email: "kuo@example.com",
        },
        {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            user_email: "jay@example.com",
        },
    ]);
};

export const down = async ({ context: queryInterface }: Record<string, QueryInterface>): Promise<void> => {
    await queryInterface.bulkDelete(TableName.User, null, {});
    await queryInterface.bulkDelete(TableName.Wallet, null, {});
};
