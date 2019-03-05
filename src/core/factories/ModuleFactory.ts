import { Injector } from "../di";

//import { ModuleSummary } from "../metadata";
import { ModuleRef } from "../refs";
import { BaseFactory } from "./BaseFactory";

export class ModuleFactory extends BaseFactory<any, ModuleRef> {

    get controllers() {
        return this.summary.controllers;
    }

    create(parent: Injector) {

        const { type, providers } = this.summary;

        //const providers = this.metadata.providers.get(this.metadata.reference);

        return new ModuleRef(this.summary, parent);
    }
}