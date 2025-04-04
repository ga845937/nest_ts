import { DecoratorKey } from "@enum/decorator.enum";
import { SetMetadata } from "@nestjs/common";

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const SkipAuthorization = (): ClassDecorator & MethodDecorator => SetMetadata(DecoratorKey.SKIP_AUTHORIZATION, true);
