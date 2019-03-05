import { ServerRegisterPluginObject } from "hapi";
import { makeDecorator, Type } from "../../common";

import { Provider } from "../di";

export interface Module {
    /**
     * The set of injectable objects that are available in the injector
     * of this module.
     */
    providers?: Provider[];

    declarations?: Type<any>[];

    /**
     * The set of Modules whose controllers
     * are available in this module.
     */
    imports?: Type<any>[];

    exports?: Type<any>[];
}

export const Module = makeDecorator(null, (module: Module) => module);