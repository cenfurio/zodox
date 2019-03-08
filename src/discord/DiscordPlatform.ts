import { createPlatform, CorePlatform, Provider } from "../core";

import { DiscordModule } from "./annotations";
import { DiscordJSModule } from "./client/discordJS";

const DISCORD_PLATFORM_PROVIDERS: Provider<any>[] = [];

export const DiscordPlatform = createPlatform(CorePlatform, DISCORD_PLATFORM_PROVIDERS);

@DiscordModule({
    imports: [
        DiscordJSModule.withConfig({
            token: 'NTUxNTc2MzIwMDE0OTQyMjA4.D2NE9Q.RaZHIBTHbBQI8OkqudOqp-IPLt8',
            prefix: 'c!'
        })
    ]
})
class MainModule {}

DiscordPlatform().loadModule(MainModule);