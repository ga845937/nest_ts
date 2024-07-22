import type { ModuleMetadata, Type, Provider } from "@nestjs/common";

import { UtilityModule } from "@module/utility/utility.module";
import { Module } from "@nestjs/common";

import { UserService } from "./provider/user.service";
import { UserController } from "./user.controller";

// info module
const metadata: ModuleMetadata = {
    imports: [UtilityModule] as Type<unknown>[],
    controllers: [UserController] as Type<unknown>[],
    providers: [UserService] as Provider[],
    exports: [UserService] as Provider[],
};

@Module(metadata)

export class UserModule { }
