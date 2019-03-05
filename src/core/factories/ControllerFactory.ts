import { Injector } from "../di";

// import { ControllerSummary } from "../metadata";
import { ControllerRef } from "../refs";
import { BaseFactory } from "./BaseFactory";

export class ControllerFactory extends BaseFactory<any, ControllerRef> {
    create(parent: Injector) {
        // const definition: ControllerDef = {
        //     type: this.metadata.type,
        //     routes: (instance) => this.metadata.routes.map(metadata => ({
        //         ...metadata.route,
        //         handler: (...args: any[]) => instance[metadata.propKey](...args)
        //     }))
        // };

        const { type, providers, routes } = this.summary;

        return new ControllerRef(type, routes, Injector.resolveAndCreate([...providers], parent));
    }
}