import { InjectionKey } from "../InjectionKey";

export class ResolvedDependency {
    constructor(
        public key: InjectionKey,
        public optional: boolean,
    ) {}
}