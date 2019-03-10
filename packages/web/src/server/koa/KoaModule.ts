import { ModuleWithProviders, ApplicationModule, APP_INITIALIZER } from "@zodox/core";

import { Server, ServerConfig, SERVER_CONFIG } from "../common";
import { WebModule } from "../../annotations";
import { KoaServer } from "./KoaServer";

async function serverInitializer(server: Server) {
    await server.listen();
}

@WebModule({
    providers: [
        {
            provide: Server,
            useClass: KoaServer
        },
        {
            provide: APP_INITIALIZER,
            useFactory: serverInitializer,
            deps: [Server],
            multi: true
        }
    ],
    exports: [
        ApplicationModule
    ]
})
export class KoaModule {
    static withConfig(config: ServerConfig): ModuleWithProviders<KoaModule> {
        return {
            module: KoaModule,
            providers: [
                {
                    provide: SERVER_CONFIG,
                    useValue: config
                }
            ]
        }
    }
}