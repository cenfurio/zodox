import { createPlatform, CorePlatform, Provider, META_RESOLVERS } from "../core";

import { ControllerResolver } from "./resolvers/ControllerResolver";
import { ApplicationRef } from "./refs/ApplicationRef";

const WEB_PLATFORM_PROVIDERS: Provider<any>[] = [
    ApplicationRef,
    {
        provide: META_RESOLVERS,
        useClass: ControllerResolver,
        multi: true
    }
]

export const WebPlatform = createPlatform(CorePlatform, WEB_PLATFORM_PROVIDERS);