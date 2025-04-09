import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";

import { Injectable } from "@nestjs/common";
import { alsService } from "@utility/index";
import { Observable, Subscriber } from "rxjs";

@Injectable()
export class ALSInterceptor implements NestInterceptor {
    public intercept = (context: ExecutionContext, next: CallHandler): Observable<unknown> => {
        return new Observable((observer: Subscriber<unknown>) => alsService.run(() => next.handle().pipe().subscribe(observer)));
    };
}
