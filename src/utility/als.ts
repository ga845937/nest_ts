import type { IAlsData } from "@type/als.interface";

import { AsyncLocalStorage } from "node:async_hooks";
import { randomBytes } from "node:crypto";

class AlsService {
    private readonly als: AsyncLocalStorage<IAlsData>;

    constructor() {
        this.als = new AsyncLocalStorage<IAlsData>();
    }

    private initData(): IAlsData {
        return {
            responseData: {},
            timestamp   : +Date.now(),
            traceID     : randomBytes(6).toString("hex"),
        };
    }

    public getStore(): IAlsData {
        return this.als.getStore();
    }

    public run(callback: () => void): void {
        if (this.als.getStore()) {
            return callback();
        }

        this.als.run(this.initData(), callback);
    }
}

export const alsService = new AlsService();
