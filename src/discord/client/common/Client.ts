import { Inject } from "../../../core";
import { CLIENT_CONFIG, ClientConfig } from "./ClientConfig";

export abstract class Client {
    constructor(@Inject(CLIENT_CONFIG) protected config: ClientConfig) {}

    abstract login(): Promise<any>;

    abstract on(event: string, callback: () => any): void;
    abstract once(event: string, callback: () => any): void;
    abstract get user(): any;
    abstract get guilds(): any;
    abstract get users(): any;
}