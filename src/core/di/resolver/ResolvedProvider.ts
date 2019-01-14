import { NormalizedProvider } from "../providers/NormalizedProvider";
import { ResolvedFactory } from "./ResolvedFactory";
import { InjectionKey } from "../InjectionKey";

export class ResolvedProvider {
    private constructor(
        public key: InjectionKey,
        public factory: ResolvedFactory
    ) {}

    static resolve(provider: NormalizedProvider<any>): ResolvedProvider {
        return new ResolvedProvider(provider.provide, ResolvedFactory.resolve(provider));
    }
}