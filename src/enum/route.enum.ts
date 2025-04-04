export enum UserRoute {
    BASE = "user",
    LOGIN = "/login",
    PASSWORD = "/password",
    QUERY = "/query",
}

export enum AgentRoute {
    BASE = "agent",
    QUERY = "/query",
}

export enum MemberRoute {
    BASE = "member",
    QUERY = "/query",
}

export enum BetOrderRoute {
    BASE = "betOrder",
}

export enum OrdersRoute {
    BASE = "orders",
}

export enum OddsRoute {
    BASE = "odds",
    QUERY = "/query",
}

export enum GameInfoRoute {
    BASE = "gameInfo",
    QUERY = "/query",
}

export type APIRoute = AgentRoute | BetOrderRoute | GameInfoRoute | MemberRoute | OddsRoute | OrdersRoute | UserRoute;
