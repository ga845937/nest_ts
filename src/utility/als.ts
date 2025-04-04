import type { IAlsData } from "@type/als.interface";

import { AsyncLocalStorage } from "node:async_hooks";

class AlsService {
    private readonly als: AsyncLocalStorage<IAlsData>;

    constructor() {
        this.als = new AsyncLocalStorage<IAlsData>();
    }

    public getStore(): IAlsData {
        return this.als.getStore();
    }

    public run(data: IAlsData, callback: () => void): void {
        this.als.run(data, callback);
    }
}

export const alsService = new AlsService();
