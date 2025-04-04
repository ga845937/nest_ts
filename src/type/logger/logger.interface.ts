export interface IVersion {
    branch: string,
    hash: string,
    projectName: string,
    projectVersion: string,
    subModule?: Record<string, IVersion>,
}

export interface ILogBase {
    level: string,
    message: string,
    timestamp: string,
    traceID: string,
    version: IVersion,
}

export interface ILogError {
    cause?: Error,
    error: Error,
}

export interface ILogSQL {
    database: string,
    duration: number,
    sql: string,
    type: string,
}

export interface IHTTPBase {
    duration: number,
    httpStatus: number,
    method: string,
    uri: string,
    request: {
        body: unknown,
        header: Record<string, unknown>,
        param?: Record<string, unknown>,
        query?: Record<string, unknown>,
    },
    response: {
        data: Record<string, unknown>,
        header: Record<string, unknown>,
    },
}

export interface ILogHTTP extends IHTTPBase {
    baseUrl: string,
    path: string,
}

export interface ILogWebSocket {
    arg: unknown,
    duration: number,
    event: string,
    responseData: Record<string, unknown>,
}

export interface ILogAPI extends IHTTPBase {}

export interface ILogGRPC {
    duration: number,
    method: string,
    package: string,
    proto: string,
    request: Record<string, unknown>,
    response: Record<string, unknown>,
    service: string,
    uri: string,
}
