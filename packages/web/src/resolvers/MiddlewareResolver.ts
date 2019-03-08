import { BaseResolver } from "../../core";
import { TypeMetadata } from "../../core/metadata";
import { Type } from "../../common";

export class MiddlewareResolver extends BaseResolver {
    isSupported(type: Type<any>): boolean {
        throw new Error("Method not implemented.");
    }
    resolve(type: Type<any>): TypeMetadata {
        throw new Error("Method not implemented.");
    }
}