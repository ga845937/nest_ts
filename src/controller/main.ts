import { UserRoute } from "@customType/route";
import { CreateUser } from "@customType/user";
import {
    Controller,
    Get, Post, Body, Param,
    HttpException,
    HttpCode, HttpStatus
} from "@nestjs/common";
import { MainProvider } from "@provider/main";

@Controller()
export class MainController {
    constructor(private readonly mainProvider: MainProvider) { }

    @Get(UserRoute.Base)
    @HttpCode(HttpStatus.OK)
    public async readUser(): Promise<string> {
        return await this.mainProvider.getHello();
    }

    @Post(UserRoute.Base)
    @HttpCode(HttpStatus.CREATED)
    public async createUser(@Body() body: CreateUser): Promise<string> {
        console.log(body);

        if (body.password === "123") {
            throw new HttpException("User already exists", HttpStatus.CONFLICT);
        }
        return await this.mainProvider.getHello();
    }
}
