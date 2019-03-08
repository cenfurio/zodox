import { Type } from "@zodox/common";

import { ModuleMetadata, TypeMetadata } from "../metadata";
import { Injectable, Inject } from '../annotations';
import { BaseResolver } from "./BaseResolver";
import { InjectionToken, Provider } from "../di";
import { ModuleResolver } from "./ModuleResolver";

export class TransitiveModule {
    modules: Type<any>[] = [];
    declarations: TypeMetadata[] = [];
    providers: { module: Type<any>, provider: Provider<any> }[] = [];

    addModule(type: Type<any>) {
        this.modules.push(type);
    }

    addDeclaration(type: TypeMetadata) {
        this.declarations.push(type);
    }

    addProvider(module: Type<any>, provider: Provider<any>) {
        this.providers.push({ module, provider });
    }
}

@Injectable()
export class MetadataResolver {
    private moduleCache = new Map<Type<any>, TransitiveModule>();

    constructor(private moduleResolver: ModuleResolver) {}

    // resolveMetadata<T extends TypeMetadata>(type: Type<any>): T {
    //     const resolver = this.resolvers.find(r => r.isSupported(type));

    //     if(!resolver) {
    //         throw new Error(`Failed to resolve metadata of ${type.name}, did you add it's resolver to the 'META_RESOLVERS' multi provider.`);
    //     }

    //     return resolver.resolve(type) as T;
    // }

    // resolveModule(type: Type<any>) {
    //     const module = this.resolveMetadata<ModuleMetadata>(type);

        
    // }

    ex_getTransitiveModule(type: Type<any>): TransitiveModule {
        if(this.moduleCache.has(type)) {
            return this.moduleCache.get(type)!;
        }

        const metadata = this.moduleResolver.resolve(type);
        const result = new TransitiveModule();

        const providerModules = new Map<any, Set<Type<any>>>();

        metadata.importedModules.concat(metadata.exportedModules).forEach(module => {
            const transitiveModule = this.ex_getTransitiveModule(module.type);

            transitiveModule.modules.forEach(mod => result.addModule(mod));
            // transitiveModule.declarations.forEach(dec => result.addDeclarations(dec));

            transitiveModule.providers.forEach(entry => {
                let prevModules = providerModules.get((entry.provider as any).provide || entry.provider); // TODO: Normalize providers, because this will not work properly
                if(!prevModules) {
                    prevModules = new Set<Type<any>>();
                    providerModules.set(entry.provider, prevModules);
                }

                // Only add if it wasn't added before
                // NOTE: Multi providers currently wont work...
                if(!prevModules.has(entry.module)) {
                    prevModules.add(entry.module);
                    result.addProvider(entry.module, entry.provider);
                }
            });
        });

        metadata.importedModules.forEach(module => {
            // If everything goes right this should already be cached
            // If not, welll...yea then this is an expensive thing to do twice.
            // TODO: Check whether caching works properly
            const transitiveModule = this.ex_getTransitiveModule(module.type);

            transitiveModule.declarations.forEach(dec => result.addDeclaration(dec));
        })

        result.addModule(type);

        metadata.providers.forEach(provider => result.addProvider(metadata.type, provider));
        metadata.declarations.forEach(dec => result.addDeclaration(dec));

        this.moduleCache.set(type, result);

        return result;
    }
}