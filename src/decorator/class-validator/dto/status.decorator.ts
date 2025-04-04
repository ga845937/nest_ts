import { IsInt, Max, Min } from "class-validator";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const StatusValidation = () =>{
    return function(target: unknown, propertyKey: string): void {
        IsInt()(target, propertyKey);
        Min(0)(target, propertyKey);
        Max(1)(target, propertyKey);
    };
};
