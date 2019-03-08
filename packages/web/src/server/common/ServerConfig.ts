import { InjectionToken } from "@zodox/core";

export const SERVER_CONFIG = new InjectionToken<ServerConfig>('Server Config');

export interface ServerConfig {
    port?: number;
    host?: string;
}