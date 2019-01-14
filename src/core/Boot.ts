import { ServerOptions, Server } from "hapi";

import { MetadataResolver } from "./resolvers";
import { ApplicationRef } from "./refs";
import { Injector } from "./di";
import { InvalidStateError } from "../common";

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
            MetadataResolver,
            ApplicationRef
        ]);

        const app = injector.get(ApplicationRef);

        if(!app) {
            throw new InvalidStateError(ApplicationRef);
        }

        return app;
    }
}