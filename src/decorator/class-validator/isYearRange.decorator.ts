import type { ValidationArguments, ValidationOptions } from "class-validator";

import { registerDecorator } from "class-validator";

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const IsYearRange = (validationOptions?: ValidationOptions) => {
    return (object: object, propertyName: string): void => {
        registerDecorator({
            name        : "isYearRange",
            options     : validationOptions,
            propertyName: propertyName,
            target      : object.constructor,
            validator   : {
                defaultMessage() {
                    return "yearBegin and yearEnd must either both be provided or both be omitted";
                },
                validate(value: unknown, args: ValidationArguments) {
                    const obj = args.object as { yearBegin?: number, yearEnd?: number };
                    let numberType = 0;
                    let otherType = 0;

                    for (const typeString of [typeof obj.yearBegin, typeof obj.yearEnd]) {
                        if (typeString === "number") {
                            numberType++;
                        }
                        else {
                            otherType++;
                        }
                    }
                    if (numberType !== 2 || otherType !== 2) {
                        return false;
                    }
                    return true;
                },
            },
        });
    };
};
