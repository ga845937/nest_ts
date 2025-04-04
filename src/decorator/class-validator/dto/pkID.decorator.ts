import { IsInt, Min } from "class-validator";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const PKIDValidation = () =>{
    return function(target: unknown, propertyKey: string): void {
        IsInt()(target, propertyKey);
        Min(1)(target, propertyKey);
    };
};
