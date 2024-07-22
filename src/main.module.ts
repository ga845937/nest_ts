import type { ModuleMetadata, Type, Provider } from "@nestjs/common";

import { UserModule } from "module/user/user.module";

import { Module } from "@nestjs/common";

const metadata: ModuleMetadata = {
    imports: [UserModule] as Type<unknown>[],
    controllers: [] as Type<unknown>[],
    providers: [] as Provider[],
    exports: [] as Provider[],
};

@Module(metadata)

export class MainModule { }
