import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUser {
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @IsString()
    public password: string;
}
