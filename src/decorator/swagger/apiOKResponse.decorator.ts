import type { Type } from "@nestjs/common";

import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, ApiResponseProperty, getSchemaPath } from "@nestjs/swagger";

class ResponseData<T> {
    @ApiResponseProperty()
    public data?: T;

    @ApiResponseProperty()
    public traceID: string;
}

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const ApiOKResponse = <T>(model: Type<T> | [Type<T>], status: HttpStatus = HttpStatus.OK): ((...args: unknown[]) => unknown) => {
    const isArray = Array.isArray(model);
    const schema = isArray
        ? {
            items: { $ref: getSchemaPath((model as [Type<T>])[0]) },
            type : "array",
        }
        : { $ref: getSchemaPath(model as Type<T>) };

    return applyDecorators(
        ApiExtraModels(ResponseData, ...(isArray ? (model as [Type<T>]) : [model])),
        ApiResponse({
            status,
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ResponseData) },
                    {
                        properties: {
                            data: schema,
                        },
                    },
                ],
            },
        }),
    );
};
