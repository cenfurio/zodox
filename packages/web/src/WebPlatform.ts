import { createPlatform, CorePlatform, Provider, META_RESOLVERS, Module, ApplicationModule, MODULE_DECLARATION_HANDLER } from "@zodox/core";

import { ControllerResolver } from "./resolvers/ControllerResolver";
import { ApplicationRef } from "./refs/ApplicationRef";
import { Controller, WebModule } from "./annotations";
import { ControllerHandler } from "./handlers/ControllerHandler";
import { Middleware } from "./annotations/middleware";
import { KoaModule } from "./server/koa";

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

@Middleware('auth')
class AuthMiddleware {
    async process() {

    }
}

@Controller({
    path: '/test'
})
class TestController {

    // @Get('/test')
    async getSomething() {

    }
}

@WebModule({
    controllers: [TestController],
    //middleware: [AuthMiddleware],
    imports: [
        KoaModule.withConfig({
            port: 3000,
            host: '0.0.0.0'
        })
    ]
})
class MainModule {
    onStart(appRef: ApplicationRef) {
        console.log('Hi there');
    }
}

WebPlatform().loadModule(MainModule);