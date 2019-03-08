import { Reflector } from "@zodox/common";

import { NormalizedProvider } from "../providers/NormalizedProvider";
import { ResolvedDependency } from "./ResolvedDependency";
import { Resolver, VisibilityFlag } from "./Resolver";

export class ResolvedFactory {
    private constructor(
        public factory: Function,
        public dependencies: ResolvedDependency[]
    ) {}

    static resolve(provider: NormalizedProvider<any>): ResolvedFactory {
        let factoryFn: Function;
        let deps: ResolvedDependency[] = [];

        if(provider.useClass) {
            factoryFn = Reflector.factory(provider.useClass);
            deps = Resolver.resolveDependencies(provider.useClass);
        } else if(provider.useFactory) {
            factoryFn = provider.useFactory;
            deps = this.constructFactoryDeps(provider.useFactory, provider.deps)
        } else {
            factoryFn = () => provider.useValue;
        }

        return new ResolvedFactory(factoryFn, deps);
    }

    private static constructFactoryDeps(type: Function, dependencies: any[]): ResolvedDependency[] {
        if(!dependencies) {
            //return Resolver.resolveDependencies(type);
            //console.log(Reflector.ownParameters(type as any));
            console.warn('[WARN]: Please specify the dependencies to use in this factory.')
            return [];
        }

        return dependencies.map(dep => new ResolvedDependency(dep, false, VisibilityFlag.Default));
    }
}