import { StringLengthValidation } from "./stringLength.decorator";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AccountValidation = (): PropertyDecorator => StringLengthValidation(50);
