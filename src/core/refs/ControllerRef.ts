import { ServerRoute } from "hapi";
import { Type, Destroyable } from "../../common";

// import { RouteMetadata } from "../metadata";
import { Injector } from "../di";

export class ControllerRef implements Destroyable {

    readonly injector: Injector;
    readonly instance: any;
    readonly routes: ReadonlyArray<ServerRoute>;

    constructor(type: Type<any>, routes: ReadonlyArray<[string, any]>, parentInjector: Injector) {
        this.injector = Injector.resolveAndCreate([{
            provide: ControllerRef,
            useValue: this
        }, type], parentInjector);

        this.instance = this.injector.get(type)

        this.routes = routes.map(([propName, route]) => ({
            ...route,
            handler: (...args: any[]) => this.instance[propName](...args)
        }));
    }

    destroy() {

    }
}