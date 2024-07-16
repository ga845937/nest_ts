import type { initModels } from "@db/postgres/entity/init-models";
import type { UserCreationAttributes, UserAttributes } from "@db/postgres/entity/user";
import type { NonNullFindOptions, UpdateOptions, DestroyOptions } from "sequelize";

import { PostgresDatabase } from "@customType/db";
import { Injectable, Inject } from "@nestjs/common";

import { CreateUserRequest } from "./user.type";

@Injectable()
export class UserProvider {
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
}
