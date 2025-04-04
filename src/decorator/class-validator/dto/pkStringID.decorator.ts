import { IsString, MinLength } from "class-validator";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const PKStringIDValidation = () =>{
    return function(target: unknown, propertyKey: string): void {
        IsString()(target, propertyKey);
        MinLength(1)(target, propertyKey);
    };
};
