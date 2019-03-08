import { Type, Reflector } from '@zodox/common';

import { Inject, Self, SkipSelf, Optional } from "../../annotations";
import { NormalizedProvider } from "../providers/NormalizedProvider";
import { ResolvedDependency } from "./ResolvedDependency";
import { ResolvedProvider } from "./ResolvedProvider";
import { Provider } from "../providers";
import { InjectionKey } from '../InjectionKey';

export enum VisibilityFlag {
    Default = 0,
    Self = 1 << 0,
    SkipSelf = 1 << 1,
}

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
        const resolved = normalized.map(ResolvedProvider.resolve);

        return this.dedupeResolvedProviders(resolved);
    }

    static resolveDependencies(type: Type<any>): ResolvedDependency[] {
        const params = Reflector.parameters(type);

        return params.map(param => {
            let token;
            let optional = false;
            let visibility = VisibilityFlag.Default;

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

                // Visibility flags
                // TODO: Warn the user if they set multiple flags, this is not supported
                if(meta instanceof Self) {
                    visibility = VisibilityFlag.Self
                }
                if(meta instanceof SkipSelf) {
                    visibility = VisibilityFlag.SkipSelf
                }
            }
            return new ResolvedDependency(token, optional, visibility);
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
                throw new Error(`Invalid provider: ${JSON.stringify(provider)}`);
            }
        }

        return result as NormalizedProvider<any>[];
    }

    private static dedupeResolvedProviders(providers: ResolvedProvider[]): ResolvedProvider[] {
        const cache = new Map<InjectionKey, ResolvedProvider>();

        for(const provider of providers) {
            const existing = cache.get(provider.key);

            if(existing) {
                if(provider.multi !== existing.multi) {
                    throw new Error('NO_MIX_MULTI_PROVIDER'); // TODO: Write proper error message
                }

                if(provider.multi) {
                    existing.factories = [...existing.factories, ...provider.factories]
                } else {
                    cache.set(provider.key, provider);
                }
            } else {
                cache.set(provider.key, provider);
            }
        }

        return [...cache.values()];
    }
}