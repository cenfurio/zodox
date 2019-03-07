import { createPlatform, CorePlatform, Provider, META_RESOLVERS, Module } from "../core";

import { ControllerResolver } from "./resolvers/ControllerResolver";
import { ApplicationRef } from "./refs/ApplicationRef";
import { Controller, WebModule } from "./annotations";
import { ApplicationModule } from "../core/ApplicationModule";
import { MODULE_DECLARATION_HANDLER } from "../core/refs/ModuleRef";
import { ControllerHandler } from "./handlers/ControllerHandler";

const WEB_PLATFORM_PROVIDERS: Provider<any>[] = [
    {
        provide: META_RESOLVERS,
        useClass: ControllerResolver,
        multi: true
    },
    {
        provide: MODULE_DECLARATION_HANDLER,
        useClass: ControllerHandler,
        multi: true
    }
]

export const WebPlatform = createPlatform(CorePlatform, WEB_PLATFORM_PROVIDERS);

@Controller({
    path: '/test'
})
class TestController {}

@WebModule({
    controllers: [TestController],
    //providers: [ApplicationRef],
    imports: [ApplicationModule]
})
class MainModule {
    onStart(appRef: ApplicationRef) {
        console.log('Hi there');
    }
}

WebPlatform().loadModule(MainModule);