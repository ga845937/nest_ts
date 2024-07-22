import type { CreateUserRequest, UserFindByPKAttributes } from "../user.type";
import type { initModels } from "@db/postgres/entity/init-models";
import type { UserCreationAttributes, UserAttributes } from "@db/postgres/entity/user";
import type { NonNullFindOptions } from "sequelize";

import { Injectable, Inject } from "@nestjs/common";
import { PostgresDatabase } from "type/db";

@Injectable()
export class UserService {
    constructor(
        @Inject(PostgresDatabase.NODEJS) private readonly nodejsDB: ReturnType<typeof initModels>
    ) { }

    public createUser = async (body: CreateUserRequest): Promise<void> => {
        const data: UserCreationAttributes = {
            email: body.email,
            name: body.name,
            status: "INACTIVE",
        };

        await this.nodejsDB.User.create(data);
    };

    public readUserByPK = async ({ email }: UserFindByPKAttributes): Promise<UserAttributes> => {
        const findOption: NonNullFindOptions<UserAttributes> = {
            rejectOnEmpty: true,
            raw: true,
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.nodejsDB.User.findByPk(email, findOption);
    };
}
