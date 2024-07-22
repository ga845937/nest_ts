import type { UserAttributes } from "@db/postgres/entity/user";

import {
    Controller,
    Get, Post,
    Body, Query,
    HttpException,
    HttpCode, HttpStatus,
} from "@nestjs/common";
import { ErrorMessage } from "@type/error";
import { UserRoute } from "@type/route";
import { UniqueConstraintError } from "sequelize";

import { UserService } from "./provider/user.service";
import { CreateUserRequest, ReadUserRequest } from "./user.type";

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post(UserRoute.Base)
    @HttpCode(HttpStatus.CREATED)
    public async createUser(@Body() body: CreateUserRequest): Promise<void> {
        try {
            return await this.userService.createUser(body);
        }
        catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new HttpException(ErrorMessage.UserExists, HttpStatus.CONFLICT);
            }
            throw new HttpException(ErrorMessage.ServerError, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(UserRoute.Base)
    @HttpCode(HttpStatus.OK)
    public async readUser(@Query() query: ReadUserRequest): Promise<UserAttributes> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.userService.readUserByPK(query);
    }
}
