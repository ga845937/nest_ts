import type { UserAttributes } from "@database/postgres/entity/user";

import { ApiOKResponse } from "@decorator/index";
import { ErrorMessage } from "@enum/error.enum";
import { UserRoute } from "@enum/route.enum";
import {
    Body,
    Controller, Get,
    HttpCode, HttpException,
    HttpStatus,
    Post, Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UniqueConstraintError } from "sequelize";

import { UserService } from "./provider/user.service";
import { CreateUserRequest, ReadUserRequest } from "./user.type";

@ApiTags(UserRoute.BASE)
@Controller(UserRoute.BASE)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiOKResponse(String)
    @ApiOperation({ summary: "創建使用者" })
    @HttpCode(HttpStatus.CREATED)
    @Post()
    public async createUser(@Body() body: CreateUserRequest): Promise<void> {
        try {
            return await this.userService.createUser(body);
        }
        catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new HttpException(ErrorMessage.DATA_CONFLICT, HttpStatus.CONFLICT);
            }
            throw new HttpException(ErrorMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOKResponse(String)
    @ApiOperation({ summary: "查詢使用者" })
    @Get()
    @HttpCode(HttpStatus.OK)
    public async readUser(@Query() query: ReadUserRequest): Promise<UserAttributes> {
        return await this.userService.readUserByPK(query);
    }
}
