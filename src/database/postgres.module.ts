import type { ModuleMetadata, Provider } from "@nestjs/common";

import { Module } from "@nestjs/common";

import { postgresProvider } from "./postgres/postgres.provide";

const metadata: ModuleMetadata = {
    exports  : postgresProvider as Provider[],
    providers: postgresProvider as Provider[],
};

@Module(metadata)
export class PostgresModule { }
