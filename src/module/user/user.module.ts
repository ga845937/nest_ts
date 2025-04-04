import type { ModuleMetadata, Provider, Type } from "@nestjs/common";

import { UtilityModule } from "@module/utility/utility.module";
import { Module } from "@nestjs/common";

import { UserService } from "./provider/user.service";
import { UserController } from "./user.controller";

const metadata: ModuleMetadata = {
    controllers: [UserController] as Type<unknown>[],
    exports    : [UserService] as Provider[],
    imports    : [UtilityModule] as Type<unknown>[],
    providers  : [UserService] as Provider[],
};

@Module(metadata)

export class UserModule { }
