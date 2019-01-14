import { Type } from "../lang";

export class InvalidStateError extends Error {
    constructor(type: Type<any>) {
        super(`The application seems to be in an invalid state, was unable to find ${type.name}`);
    }
}