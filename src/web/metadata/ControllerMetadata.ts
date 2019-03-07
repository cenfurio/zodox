import { Type, Omit } from "../../common";
import { Provider } from "../../core";
import { ServerRoute, RouteOptions } from "hapi";
import { DeclarationMetadata } from "../../core/metadata/DeclarationMetadata";

export class ControllerMetadata implements DeclarationMetadata {
    // declarationType: string;
    type: Type<any>;
    providers: Provider<any>[];

    constructor({ type, providers }: { type: Type<any>, providers?: Provider<any>[] }) {
        this.type = type;
        this.providers = providers || [];
    }
}

// export interface ControllerSummary {
//     type: Type<any>;
//     providers: ReadonlyArray<Provider>;
//     routes: ReadonlyArray<[string, RouteMetadata]>;
// }

// export class ControllerMetadata {
//     private type: Type<any>;
//     private providers: Provider[] = [];
//     private routes = new Map<string, RouteMetadata>();

//     constructor(type: Type<any>) {
//         this.type = type;
//     }

//     addProvider(provider: Provider) {
//         this.providers.push(provider);
//     }

//     addRoute(propKey: string, route: RouteMetadata) {
//         if(!this.routes.has(propKey)) {
//             this.routes.set(propKey, route);
//         }
//     }

//     addRouteOptions(propKey: string, options: RouteOptions) {
//         if(!this.routes.has(propKey)) {
//             // TODO: Make a better error
//             throw new Error('No route configuration specified');
//         }
        
//         const route = this.routes.get(propKey)!;

//         // TODO: Merge them together properly...
//         this.routes.set(propKey, {
//             ...route,
//             options: {
//                 ...route.options,
//                 ...options
//             }
//         });
//     }

//     toSummary(): ControllerSummary {
//         const routes: [string, RouteMetadata][] = [];

//         this.routes.forEach((route, propName) => {
//             routes.push([propName, route]);
//         });

//         return {
//             type: this.type,
//             providers: this.providers,
//             routes
//         }
//     }
// }


// export interface RouteMetadata extends Omit<ServerRoute, "handler"> {
// }