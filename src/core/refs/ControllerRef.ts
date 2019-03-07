import { ServerRoute } from "hapi";
import { Type, Destroyable } from "../../common";

// import { RouteMetadata } from "../metadata";
import { Injector } from "../di";

export class ControllerRef implements Destroyable {

    readonly injector: Injector;
    readonly instance: any;
    readonly routes: ReadonlyArray<ServerRoute>;

    private destroyCallbacks: (() => void)[] | null = [];

    constructor(type: Type<any>, routes: ReadonlyArray<[string, any]>, parentInjector: Injector) {
        this.injector = Injector.resolveAndCreate([{
            provide: ControllerRef,
            useValue: this
        }, type], parentInjector);

        this.instance = this.injector.get(type);

        this.routes = routes.map(([propName, route]) => ({
            ...route,
            handler: (...args: any[]) => this.instance[propName](...args)
        }));
    }

    onDestroy(callback: () => void) {
        if(this.destroyCallbacks) {
            this.destroyCallbacks.push(callback);
        }
    }

    destroy() {
        if(this.destroyCallbacks) {
            this.destroyCallbacks.forEach(callback => callback());
            this.destroyCallbacks = null;
        }
    }
}