import { Type } from "../../common";
import { Injector, Provider } from "../di";
import { ApplicationInitializer, ApplicationRef } from "./ApplicationRef";
import { ModuleRef } from "./ModuleRef";
import { MetadataResolver } from "../resolvers";
import { Injectable } from "../annotations";

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

    async loadModule(module: Type<any>): Promise<any> {
        // const moduleMeta = this.resolver.resolveModule(module);
        console.log(this.resolver.ex_getTransistiveModule(module));
        return;

        // TODO: Actually use the module metadata....
        const moduleRef = new ModuleRef(module, this.injector);

        const appInitializer = moduleRef.injector.get(ApplicationInitializer);

        // Wait for all app initializers to finish
        await appInitializer.promise;

        // Time to boot the application
        const appRef: ApplicationRef = moduleRef.injector.get(ApplicationRef as any);

        appRef.start();

        return moduleRef;
    }
}