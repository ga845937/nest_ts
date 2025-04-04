import { IsString, MaxLength } from "class-validator";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const StringLengthValidation = (length: number) => {
    return function(target: unknown, propertyKey: string): void {
        IsString()(target, propertyKey);
        MaxLength(length)(target, propertyKey);
    };
};
