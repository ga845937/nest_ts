import type { ModuleMetadata, Type, Provider } from "@nestjs/common";

import { MainController } from "@controller/main";
import { Module } from "@nestjs/common";
import { MainProvider } from "@provider/main";

const metadata: ModuleMetadata = {
    imports: [],
    controllers: [MainController] as Type<unknown>[],
    providers: [MainProvider] as Provider[],
};

@Module(metadata)

export class MainModule { }
