import type { ModuleMetadata, Type, Provider } from "@nestjs/common";

import { UtilityModule } from "@module/utility/utility.module";
import { Module } from "@nestjs/common";

import { UserController } from "./user.controller";
import { UserProvider } from "./user.provider";

// info module
const metadata: ModuleMetadata = {
    imports: [UtilityModule] as Type<unknown>[],
    controllers: [UserController] as Type<unknown>[],
    providers: [UserProvider] as Provider[],
    exports: [UserProvider] as Provider[],
};

@Module(metadata)

export class UserModule { }
