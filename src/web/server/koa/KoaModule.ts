import { WebModule } from "../../annotations";
import { ModuleWithProviders } from "../../../core/annotations";
import { ApplicationModule } from "../../../core/ApplicationModule";
import { Server, ServerConfig, SERVER_CONFIG } from "../common";
import { KoaServer } from "./KoaServer";
import { APP_INITIALIZER } from "../../../core/ApplicationInitializer";

async function serverInitializer(server: Server) {
    return await server.listen();
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