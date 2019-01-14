import { InjectionKey } from "../../core/di";

export class NoProviderError extends Error {
    constructor(key: InjectionKey) {
        super(`No provider for ${key}`);
    }
}