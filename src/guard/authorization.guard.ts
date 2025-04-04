import type { CanActivate, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";

import { jwtSecret } from "@constant/jsonWebToken.constant";
import { DecoratorKey } from "@enum/decorator.enum";
import { ErrorMessage } from "@enum/error.enum";
import { HeaderKey } from "@enum/header.enum";
import { UserRoute } from "@enum/route.enum";
import { BadRequestException, ForbiddenException, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import jsonWebToken from "jsonwebtoken";

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) { }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const skipAuthorization = this.reflector.get<boolean>(DecoratorKey.SKIP_AUTHORIZATION, context.getHandler());
            if (skipAuthorization) {
                return true;
            }

            const request = context.switchToHttp().getRequest<Request>();
            const header = (request.headers as unknown) as Record<string, string>;
            const authorization = header[HeaderKey.AUTHORIZATION];

            if (!authorization) {
                throw new ForbiddenException();
            }

            const bearerPrefix = "Bearer ";
            if (!authorization.startsWith(bearerPrefix)) {
                throw new BadRequestException(ErrorMessage.INVALID_AUTHORIZATION_FORMAT);
            }

            const jwtToken = authorization.replace(bearerPrefix, "");
            await jsonWebToken.verify(jwtToken, jwtSecret);

            request.userInfo = jsonWebToken.decode(jwtToken, { json: true }) as IUserInfo;
            if (request.userInfo.exp * 1000 < Date.now()) {
                throw new UnauthorizedException(ErrorMessage.SESSION_EXPIRED);
            }

            if (!request.path.endsWith(UserRoute.LOGIN) && !request.userInfo.verification) {
                throw new ForbiddenException(ErrorMessage.TWO_FA_ERROR);
            }

            return true;
        }
        catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new UnauthorizedException(ErrorMessage.SESSION_EXPIRED, { cause: error });
        }
    }
}
