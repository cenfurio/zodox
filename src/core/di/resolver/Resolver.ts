import { Type, Reflector } from '../../../common';
import { Inject, Self, SkipSelf, Optional } from "../../annotations";
import { NormalizedProvider } from "../providers/NormalizedProvider";
import { ResolvedDependency } from "./ResolvedDependency";
import { ResolvedProvider } from "./ResolvedProvider";
import { Provider } from "../providers";

export class Resolver {

    static resolveProvider(provider: Provider<any>): ResolvedProvider {
        let normalizedProvider = provider;
        if(provider instanceof Function) {
            normalizedProvider = { provide: provider, useClass: provider };
        }

        return ResolvedProvider.resolve(normalizedProvider as NormalizedProvider<any>);
    }

    static resolveProviders(providers: Provider<any>[]): ResolvedProvider[] {
        const normalized = this.normalizeProviders(providers);
        
        // TODO: Dedupe normalized list of providers

        return normalized.map(ResolvedProvider.resolve);
    }

    static resolveDependencies(type: Type<any>): ResolvedDependency[] {
        const params = Reflector.parameters(type);

        return params.map(param => {
            let token;
            let optional = false;
            //let visibility: Self | SkipSelf | null = null;

            for(const meta of param) {
                if(meta instanceof Function) {
                    token = meta;
                }
                if(meta instanceof Inject) {
                    token = meta.token;
                }
                if(meta instanceof Optional) {
                    optional = true;
                }
                if(meta instanceof Self || meta instanceof SkipSelf) {
                    console.warn('[WARN]: visibility flags are not supported yet');
                    // TODO: Add visibility flags;
                }
            }
            return new ResolvedDependency(token, optional);
        });
    }

    /**
     * Normalizes a list of {@link Provider<any>[]}
     * @param providers List of raw providers
     * @param result A previous result
     */
    private static normalizeProviders(providers: Provider<any>[], result: Provider<any>[] = []): NormalizedProvider<any>[] {
        for(const provider of providers) {
            if(provider instanceof Function) { // Type<any>
                result.push({ provide: provider, useClass: provider })
            }
            else if(typeof provider === 'object' && provider.provide != undefined) {
                result.push(provider);
            }
            else if(provider instanceof Array) {
                this.normalizeProviders(provider, result);
            } else {
                throw new Error('Invalid provider');
            }
        }

        return result as NormalizedProvider<any>[];
    }
}