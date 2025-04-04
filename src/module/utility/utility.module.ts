import type { ModuleMetadata, Provider, Type } from "@nestjs/common";

import { PostgresModule } from "@database/postgres.module";
import { Module } from "@nestjs/common";
import { Validator } from "@pipe/validator.pipe";

const metadata: ModuleMetadata = {
    controllers: [] as Type<unknown>[],
    exports    : [PostgresModule, Validator] as Provider[],
    imports    : [PostgresModule] as Type<unknown>[],
    providers  : [Validator] as Provider[],
};

@Module(metadata)

export class UtilityModule { }
