import type { CreateUserRequest, UserFindByPKAttributes } from "../user.type";
import type { initModels } from "@database/postgres/entity/init-models";
import type { UserAttributes, UserCreationAttributes } from "@database/postgres/entity/user";
import type { NonNullFindOptions } from "sequelize";

import { PostgresDatabase } from "@database/enum/postgres/database.enum";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
    constructor(
        @Inject(PostgresDatabase.NODEJS) private readonly nodejsDB: ReturnType<typeof initModels>,
    ) { }

    public createUser = async(body: CreateUserRequest): Promise<void> => {
        const data: UserCreationAttributes = {
            email : body.email,
            name  : body.name,
            status: "INACTIVE",
        };

        await this.nodejsDB.User.create(data);
    };

    public readUserByPK = async({ email }: UserFindByPKAttributes): Promise<UserAttributes> => {
        const findOption: NonNullFindOptions<UserAttributes> = {
            raw          : true,
            rejectOnEmpty: true,
        };

        return await this.nodejsDB.User.findByPk(email, findOption);
    };
}
