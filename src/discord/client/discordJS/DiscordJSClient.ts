import { Client } from "../common";

import Discord, { ClientUser } from 'discord.js';

export class DiscordJSClient extends Client {
    private app = new Discord.Client();

    login(): Promise<any> {
        return this.app.login(this.config.token);
    }

    on(event: string, callback: () => any) {
        this.app.on(event, callback);
    }

    once(event: string, callback: () => any) {
        this.app.once(event, callback);
    }

    get user() {
        return this.app.user as ClientUser;
    }

    get guilds() {
        return this.app.guilds;
    }

    get users() {
        return this.app.users;
    }
}