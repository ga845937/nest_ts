import type { Type } from "@nestjs/common";

import { UserModule } from "@module/user/user.module";
import { UtilityModule } from "@module/utility/utility.module";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { AuthorizationGuard } from "./authorization.guard";

@Module({
    imports  : [UserModule, UtilityModule] as Type<unknown>[],
    providers: [
        {
            provide : APP_GUARD,
            useClass: AuthorizationGuard,
        },
    ],
})
export class GuardModule { }
