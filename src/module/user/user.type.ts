import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export enum UserRoute {
    Base = "/user",
}

export class CreateUserRequest {
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @IsString()
    public password: string;
}
