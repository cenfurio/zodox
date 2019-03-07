import { Inject } from "../../../core";
import { SERVER_CONFIG, ServerConfig } from "./ServerConfig";

export abstract class Server {
    constructor(@Inject(SERVER_CONFIG) protected config: ServerConfig) {}

    abstract use(middleware: any): boolean;
    abstract listen(): Promise<boolean>;
}