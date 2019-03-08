import { InjectionToken } from "../../../core";

export const CLIENT_CONFIG = new InjectionToken<ClientConfig>('Client Config');

export interface ClientConfig {
    token: string;
    prefix: string;
}