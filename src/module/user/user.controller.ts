import { ErrorMessage } from "@customType/error";
import {
    Controller,
    Get, Post, Put, Delete,
    Body, Query,
    HttpException,
    HttpCode, HttpStatus,
} from "@nestjs/common";
import { UniqueConstraintError } from "sequelize";

import { UserProvider } from "./user.provider";
import { UserRoute, CreateUserRequest } from "./user.type";

@Controller()
export class UserController {
    constructor(private readonly userProvider: UserProvider) { }

    @Post(UserRoute.Base)
    @HttpCode(HttpStatus.CREATED)
    public async createUser(@Body() body: CreateUserRequest): Promise<void> {
        try {
            return await this.userProvider.createUser(body);
        }
        catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new HttpException(ErrorMessage.UserExists, HttpStatus.CONFLICT);
            }
            throw new HttpException(ErrorMessage.ServerError, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
