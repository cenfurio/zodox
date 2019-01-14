import { Type, Destroyable } from "../../common";
import { Injector } from "../di";

export class ModuleRef implements Destroyable {

    public instance: any;
    public injector: Injector;

    constructor(type: Type<any>, parentInjector: Injector) {
        this.injector = Injector.resolveAndCreate([{
            provide: ModuleRef,
            useValue: this
        }, type], parentInjector);

        this.instance = this.injector.get(type);
    }

    destroy() {
        // TODO: Actually destroy everything inside this module
    }
}