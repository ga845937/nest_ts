import type { UserAttributes, UserPk } from "@database/postgres/entity/user";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export type UserFindByPKAttributes = Pick<UserAttributes, UserPk>;
export type UserStatusEnum = UserAttributes["status"];

export class CreateUserRequest {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
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
    @IsEmail()
    @IsNotEmpty()
    public email: string;
}

export class UpdateUserRequest {
    @IsEmail()
    @IsNotEmpty()
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
