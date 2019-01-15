import { ServerRegisterPluginObject } from "hapi";
import { makeDecorator, Type } from "../../common";

import { Provider } from "../di";
import { ServerAuthConfig } from "hapi";

//register<T>(plugin: ServerRegisterPluginObject<T>, options?: ServerRegisterOptions): Promise<void>;
/* tslint:disable-next-line:no-unnecessary-generics */
//register<T, U, V, W, X, Y, Z>(plugins: ServerRegisterPluginObjectArray<T, U, V, W, X, Y, Z>, options?: ServerRegisterOptions): Promise<void>;
//register(plugins: Array<ServerRegisterPluginObject<any>>, options?: ServerRegisterOptions): Promise<void>;
/* tslint:disable-next-line:unified-signatures */
//register(plugins: Plugin<any> | Array<Plugin<any>>, options?: ServerRegisterOptions): Promise<void>;

export interface ModuleAuthStrategy<T> {
    /**
     * The strategy name
     */
    name: string;

    /**
     * The scheme name
     */
    scheme: string;

    /**
     * The scheme options based on the scheme requirements
     */
    options?: T
}

export interface ModuleAuth {
    /**
     * Set of authentication strategies to be registered
     */
    strategies?: ModuleAuthStrategy<any>[];

    /**
     * Sets a default strategy which is applied to every route
     */
    default?: string | ServerAuthConfig;
}

export interface Module {
    /**
     * The set of injectable objects that are available in the injector
     * of this module.
     */
    providers?: Provider[];

    /**
     * The set of controllers that belong to this module.
     */
    controllers?: Type<any>[];

    /**
     * The set of Modules whose controllers
     * are available in this module.
     */
    imports?: Type<any>[];

    /**
     * Specify the auth configuration
     * 
     * NOTE: This is only allowed in your MainModule
     */
    auth?: ModuleAuth;

    plugins?: ServerRegisterPluginObject<any>[];
}

export const Module = makeDecorator(null, (module: Module) => module);