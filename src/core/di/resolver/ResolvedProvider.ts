import { NormalizedProvider } from "../providers/NormalizedProvider";
import { ResolvedFactory } from "./ResolvedFactory";
import { InjectionKey } from "../InjectionKey";

export class ResolvedProvider {
    private constructor(
        public key: InjectionKey,
        public factories: ResolvedFactory[],
        public multi: boolean
    ) {}

    get factory() {
        return this.factories[0];
    }

    static resolve(provider: NormalizedProvider<any>): ResolvedProvider {
        return new ResolvedProvider(provider.provide, [ResolvedFactory.resolve(provider)], provider.multi || false);
    }
}