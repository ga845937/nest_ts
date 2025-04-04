import type { ValidationArguments, ValidationOptions } from "class-validator";

import { registerDecorator } from "class-validator";

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const IsSortKey = (objectKey: string[], validationOptions?: ValidationOptions) => {
    return function(object: object, propertyName: string): void {
        registerDecorator({
            name        : "isSortKey",
            options     : validationOptions,
            propertyName: propertyName,
            target      : object.constructor,
            validator   : {
                defaultMessage(): string {
                    return "Sort key must be a valid property of the class and order must be either \"asc\" or \"desc\"";
                },
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                validate(value: unknown, args: ValidationArguments): boolean {
                    const validOrder: SortOrder[] = [-1, 1, "asc", "ascending", "desc", "descending"];
                    if (!value || typeof value !== "object") {
                        return false;
                    }

                    const { key, order } = value as { key: string, order: SortOrder };
                    return objectKey.includes(key) && validOrder.includes(order);
                },
            },
        });
    };
};
