declare global {
    type SortOrder = -1 | "asc" | "ascending" | "desc" | "descending" | 1;

    interface IUserInfo {
        readonly account: string,
        readonly agentId: number,
        readonly exp?: number,
        readonly id: number,
        readonly roleId: number,
        readonly verification: boolean,
    }

    namespace Express {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        export interface Request {
            userInfo: IUserInfo,
        }
    }
}

export {};
