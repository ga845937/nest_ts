import type { CanActivate, ExecutionContext } from "@nestjs/common";

import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthorizationGuard implements CanActivate {
    public canActivate = async (context: ExecutionContext): Promise<boolean> => {
        const request = context.switchToHttp().getRequest<Request>();
        const header = (request.headers as unknown) as Record<string, string>;

        console.log(header?.authorization === "123456");
        return true;
        //return validateRequest(request);
    };
}
