import { ServerOptions, Server } from "hapi";

import { MetadataResolver, LifecycleResolver } from "./resolvers";
import { ApplicationRef } from "./refs";
import { Injector } from "./di";
import { InvalidStateError } from "../common";
import { LifecycleService } from "./services/LifecycleService";

export class Boot {

    /**
     * Creates a new {@link ApplicationRef} with the specified options
     * @param config The config to pass over to hapi
     */
    static getApplication(config?: ServerOptions): ApplicationRef {
        const injector = Injector.resolveAndCreate([
            {
                provide: Server,
                useFactory: () => new Server(config),
                deps: []
            },
            LifecycleResolver,
            MetadataResolver,
            ApplicationRef,
            LifecycleService
        ]);

        const app = injector.get(ApplicationRef);

        if(!app) {
            throw new InvalidStateError(ApplicationRef);
        }

        return app;
    }
}