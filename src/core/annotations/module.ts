//import { ServerRegisterPluginObject } from "hapi";
import { makeDecorator, Type } from "../../common";

import { Provider } from "../di";

//register<T>(plugin: ServerRegisterPluginObject<T>, options?: ServerRegisterOptions): Promise<void>;
/* tslint:disable-next-line:no-unnecessary-generics */
//register<T, U, V, W, X, Y, Z>(plugins: ServerRegisterPluginObjectArray<T, U, V, W, X, Y, Z>, options?: ServerRegisterOptions): Promise<void>;
//register(plugins: Array<ServerRegisterPluginObject<any>>, options?: ServerRegisterOptions): Promise<void>;
/* tslint:disable-next-line:unified-signatures */
//register(plugins: Plugin<any> | Array<Plugin<any>>, options?: ServerRegisterOptions): Promise<void>;

//type Plugin = ServerRegisterPluginObject<any> | Array<ServerRegisterPluginObject<any>>;

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

    //plugins?: Plugin[];
}

export const Module = makeDecorator((module: Module) => module);