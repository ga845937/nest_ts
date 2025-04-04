import type { ModuleMetadata, Provider, Type } from "@nestjs/common";

import { FilterModule } from "@filter/filter.module";
import { GuardModule } from "@guard/guard.module";
import { InterceptorModule } from "@interceptor/interceptor.module";
import { UserModule } from "@module/user/user.module";
import { Module } from "@nestjs/common";

const metadata: ModuleMetadata = {
    controllers: [] as Type<unknown>[],
    exports    : [] as Provider[],
    imports    : [GuardModule, InterceptorModule, FilterModule, UserModule] as Type<unknown>[],
    providers  : [] as Provider[],
};

@Module(metadata)

export class MainModule { }
