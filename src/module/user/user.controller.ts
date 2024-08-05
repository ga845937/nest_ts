import type { UserAttributes } from "@db/postgres/entity/user";

import {
    Controller,
    Get, Post,
    Body, Query,
    HttpException,
    HttpCode, HttpStatus,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ErrorMessage } from "@type/error";
import { UserRoute } from "@type/route";
import { UniqueConstraintError } from "sequelize";

import { UserService } from "./provider/user.service";
import { CreateUserRequest, ReadUserRequest } from "./user.type";

@ApiTags(UserRoute.Base)
@Controller(UserRoute.Base)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
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

    @Get()
    @HttpCode(HttpStatus.OK)
    public async readUser(@Query() query: ReadUserRequest): Promise<UserAttributes> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.userService.readUserByPK(query);
    }
}
