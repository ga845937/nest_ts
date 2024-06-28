import { Injectable } from "@nestjs/common";

@Injectable()
export class MainProvider {
    public getHello = async (): Promise<string> => {
        return "Hello World!";
    };
}
