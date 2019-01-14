import { ResolvedProvider, Resolver } from "./resolver";
import { InjectionKey } from "./InjectionKey";
import { NoProviderError } from "../../common";
import { Provider } from "./providers";

const THROW_NOT_FOUND = new Object();

export class Injector {
  
    private injectables = new Map<InjectionKey, any>();
    private providerMap = new Map<InjectionKey, ResolvedProvider>();

    constructor(
        providers: ResolvedProvider[],
        private parent?: Injector
    ) {
        // Convert our resolved providers into a map
        // TODO: Move this over to the Resolver
        // WARNING: It might occur a provider get's overwritten
        // gang - viction
        // owo - Paul
        providers.forEach(provider => {
            this.providerMap.set(provider.key, provider);
        });
    }
 
    get<T>(key: InjectionKey<T>, fallback?: T): T | null {
        return this.getByKey(key, fallback);
    }

    has(key: InjectionKey): boolean {
        if(key === Injector) {
            return true;
        }
        
        const exists = this.providerMap.has(key);

        if(!exists && this.parent) {
            return this.parent.has(key);
        }

        return exists;
    }

    private getByKey(key: InjectionKey, fallback: any): any {
        if(key === Injector) {
            return this;
        }

        // We already have a instance of this key
        if(this.injectables.has(key)) {
            return this.injectables.get(key);
        }

        const resolved = this.providerMap.get(key);

        // Look whether the parent injector can help us
        if(!resolved) {
            if(this.parent && this.parent.has(key)) {
                return this.parent.getByKey(key, fallback);
            }
            return this.throwOrNull(key, fallback);
        }

        return this.compileProvider(resolved);

    }

    private compileProvider(provider: ResolvedProvider) {
        const { factory, dependencies } = provider.factory;
    
        try {
            const deps = dependencies.map(dep => this.getByKey(dep.key, dep.optional ? null : THROW_NOT_FOUND));
            const instance = factory(...deps);

            // Let's cache it
            this.injectables.set(provider.key, instance);

            return instance;
        } catch(err) {
            throw err;
        }
    }

    private throwOrNull(key: InjectionKey, fallback: any) {
        if(fallback != THROW_NOT_FOUND) {
            return fallback;
        }

        throw new NoProviderError(key);
    }

    static resolve(providers: Provider<any>[]): ResolvedProvider[] {
        return Resolver.resolveProviders(providers);
    }

    static fromResolvedProviders(providers: ResolvedProvider[], parent?: Injector) {
        return new Injector(providers, parent);
    }

    static resolveAndCreate(providers: Provider<any>[], parent?: Injector) {
        const resolved = Injector.resolve(providers);

        return Injector.fromResolvedProviders(resolved, parent);
    }
}