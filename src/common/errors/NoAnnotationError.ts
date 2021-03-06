import { Type } from "../lang";

export class NoAnnotationError extends Error {
    constructor(type: Type<any>, descriptor: string) {
        super(`Unexpected ${descriptor.toLocaleLowerCase()} '${type.name}'. Please add a @${descriptor} annotation.`);
    }
}