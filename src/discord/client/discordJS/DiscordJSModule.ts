import { DiscordModule } from "../../annotations";
import { ModuleWithProviders } from "../../../core/annotations";
import { ApplicationModule } from "../../../core/ApplicationModule";
import { Client, ClientConfig, CLIENT_CONFIG } from "../common";
import { DiscordJSClient } from "./DiscordJSClient";
import { APP_INITIALIZER } from "../../../core/ApplicationInitializer";
import { ClientUser } from "discord.js";

async function clientInitializer(client: Client) {
    await client.login();

    console.log(`Logged in as ${(client.user as ClientUser).tag}`)
}

@DiscordModule({
    providers: [
        {
            provide: Client,
            useClass: DiscordJSClient
        },
        {
            provide: APP_INITIALIZER,
            useFactory: clientInitializer,
            deps: [Client],
            multi: true
        }
    ],
    exports: [
        ApplicationModule
    ]
})
export class DiscordJSModule {
    static withConfig(config: ClientConfig): ModuleWithProviders<DiscordJSModule> {
        return {
            module: DiscordJSModule,
            providers: [
                {
                    provide: CLIENT_CONFIG,
                    useValue: config
                }
            ]
        }
    }
}