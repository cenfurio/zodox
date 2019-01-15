import { ServerRoute, Util } from "hapi";
import { Provider } from "../di";

import { makeDecorator, makePropDecorator, Omit } from "../../common";
import { string } from "joi";

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

export interface RouteOptions extends Omit<ServerRoute, 'handler'>{
    method: Util.HTTP_METHODS_PARTIAL | Util.HTTP_METHODS_PARTIAL[]
}

export const Route = makePropDecorator((options: RouteOptions) => options);

function makeMethodDecorator(method: Util.HTTP_METHODS_PARTIAL) {
    return makePropDecorator((path: string) => ({ path, method }), Route);
}

export const Get = makeMethodDecorator('GET');
export const Post = makeMethodDecorator('POST');
export const Patch = makeMethodDecorator('PATCH');
export const Put = makeMethodDecorator('PUT');
export const Delete = makeMethodDecorator('DELETE');