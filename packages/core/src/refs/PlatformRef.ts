import { Type } from "@zodox/common";
import { Injector, Provider } from "../di";
import { ApplicationRef } from "./ApplicationRef";
import { ModuleRef } from "./ModuleRef";
import { MetadataResolver, TransitiveModule } from "../resolvers";
import { Injectable } from "../annotations";
import { ApplicationInitializer } from "../ApplicationInitializer";

export type PlatformFactory = (extraProviders?: Provider[]) => PlatformRef;

/**
 * Creates a new platform factory
 * @param parentPlatform    The parent platform to extend, recommended to extend the {@link CorePlatform}
 * @param providers         The platform providers
 */
export function createPlatform(parentPlatform: PlatformFactory | null, providers: Provider[]): PlatformFactory {
    return (extraProviders: Provider[] = []) => {
        if(parentPlatform) {
            return parentPlatform([...providers, ...extraProviders]);
        }
        
        const mainInjector = Injector.resolveAndCreate([...providers, ...extraProviders]);
        const platformRef = mainInjector.get(PlatformRef);
        if(!platformRef)
            throw new Error('PlatformRef provider not found. Are you not extending the CorePlatform?');
        
        return platformRef;
    }
}

@Injectable()
export class PlatformRef {

    constructor(
        private injector: Injector,
        private resolver: MetadataResolver) {}

    async loadModule<T>(module: Type<T>): Promise<ModuleRef<T>> {
        // const moduleMeta = this.resolver.resolveModule(module);
        const transitiveModule = this.resolver.ex_getTransitiveModule(module);
        const moduleFactory = this.ex_createModuleFactory(module, transitiveModule);

        const moduleRef = moduleFactory(this.injector);

        //console.log(moduleRef);

        const appInitializer = moduleRef.injector.get(ApplicationInitializer, null);
        if(!appInitializer) {
            throw new Error('No ApplicationInitializer. Is CommonModule included?')
        }

        // Wait for all app initializers to finish
        await appInitializer.promise;

        await moduleRef.declarationLoader.handleDeclarations(transitiveModule.declarations);

        // Time to boot the application
        const appRef = moduleRef.injector.get(ApplicationRef, null);
        // if(!appRef && !moduleRef.instance.onStart)
        //     appRef.start();
        // else if(module)
        appRef.start();

        return moduleRef;
    }

    private ex_createModuleFactory<T>(type: Type<T>, transitiveModule: TransitiveModule) {
        return (parentInjector: Injector) => {
            const moduleProviders = transitiveModule.modules.slice();
            const declarationProviders = transitiveModule.declarations.map(dec => dec.type);
            const providers = transitiveModule.providers.map(provider => provider.provider);

            return new ModuleRef<T>({
                type,
                providers: [...providers, ...declarationProviders, ...moduleProviders],
                declarations: transitiveModule.declarations
            }, parentInjector);
        }
    }
}