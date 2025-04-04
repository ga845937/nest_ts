import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import type { IAlsData } from "@type/als.interface";

import { randomBytes } from "node:crypto";

import { Injectable } from "@nestjs/common";
import { alsService } from "@utility/index";
import { Observable, Subscriber } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class ALSInterceptor implements NestInterceptor {
    public intercept = (context: ExecutionContext, next: CallHandler): Observable<unknown> => {
        const data: IAlsData = {
            responseData: {},
            timestamp   : +Date.now(),
            traceID     : randomBytes(6).toString("hex"),
        };

        return new Observable((observer: Subscriber<unknown>) => {
            alsService.run(data, () => {
                next.handle().pipe(
                    tap(() => alsService.getStore()),
                ).subscribe(observer);
            });
        });
    };
}
