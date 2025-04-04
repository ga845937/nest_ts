import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";

import { DecoratorKey } from "@enum/decorator.enum";
import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { alsService } from "@utility/index";
import { map, Observable } from "rxjs";

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, unknown> {
    constructor(
        private readonly reflector: Reflector,
    ) { }

    public intercept = (context: ExecutionContext, next: CallHandler): Observable<unknown> => {
        const skipResponseTransform = this.reflector.get<boolean>(DecoratorKey.SKIP_RESPONSE_TRANSFORM, context.getHandler());

        if (skipResponseTransform) {
            return next.handle();
        }

        return next.handle().pipe(
            map((data: unknown) => {
                return {
                    data,
                    traceID: alsService.getStore().traceID,
                };
            }),
        );
    };
}
