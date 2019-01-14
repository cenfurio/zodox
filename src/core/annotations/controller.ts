import { ServerRoute } from "hapi";
import { Provider } from "../di";

import { makeDecorator, makePropDecorator } from "../../common";

export interface ControllerOptions {
    /**
     * The base path of this controller,
     * all routes in this controller will be prefixed with this path
     */
    path: string;

    /**
     * The set of injectable objects that are available in the injector
     * of this controller.
     */
    providers?: Provider[]
}

export const Controller = makeDecorator((options: ControllerOptions) => options);

export const route = makePropDecorator((options: ServerRoute) => options);