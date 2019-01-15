import { ServerRoute, Util, RouteOptions, RouteOptionsAccess, RouteOptionsValidate, RouteOptionsPayload } from "hapi";
import { Provider } from "../di";

import { makeDecorator, makePropDecorator, Omit } from "../../common";

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

export const Controller = makeDecorator(null, (options: ControllerOptions) => options);

export interface RouteConfig extends Omit<ServerRoute, 'handler'>{
    method: Util.HTTP_METHODS_PARTIAL | Util.HTTP_METHODS_PARTIAL[]
}

/**
 * Marks a property as Route.
 */
export const Route = makePropDecorator(null, (options: RouteConfig) => options);


function makeRouteMethodDecorator(method: Util.HTTP_METHODS_PARTIAL) {
    return makePropDecorator(Route, (path: string, options?: RouteOptions) => ({ path, method, options }));
}

export const Get = makeRouteMethodDecorator('GET');
export const Post = makeRouteMethodDecorator('POST');
export const Patch = makeRouteMethodDecorator('PATCH');
export const Put = makeRouteMethodDecorator('PUT');
export const Delete = makeRouteMethodDecorator('DELETE');

export const RouteOption = makePropDecorator(null, (options: RouteOptions) => options);

/**
 * Route authentication configuration.
 */
export const Auth = makePropDecorator(RouteOption, (auth: false | string | RouteOptionsAccess) => ({ auth }));

/**
 * Route payload configuration
 */
export const Payload = makePropDecorator(RouteOption, (payload: RouteOptionsPayload) => ({ payload }));

/**
 * Route validation configuration
 */
export const Validate = makePropDecorator(RouteOption, (validate: RouteOptionsValidate) => ({ validate }));