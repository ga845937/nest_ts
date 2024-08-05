import type { UserAttributes, UserPk } from "@db/postgres/entity/user";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export type UserFindByPKAttributes = Pick<UserAttributes, UserPk>;
export type UserStatusEnum = UserAttributes["status"];

export class CreateUserRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(100)
    public email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    public name: string;
}

export class ReadUserRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    public email: string;
}

export class UpdateUserRequest {
    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public status: UserStatusEnum;
}
