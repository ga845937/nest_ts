import { DecoratorKey } from "@enum/decorator.enum";
import { SetMetadata } from "@nestjs/common";

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const SkipResponseTransform = (): ClassDecorator & MethodDecorator => SetMetadata(DecoratorKey.SKIP_RESPONSE_TRANSFORM, true);
