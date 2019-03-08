import { InjectionKey } from "../InjectionKey";
import { VisibilityFlag } from "./Resolver";

export class ResolvedDependency {
    constructor(
        public key: InjectionKey,
        public optional: boolean,
        public visibility: VisibilityFlag
    ) {}
}