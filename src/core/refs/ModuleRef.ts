import { Type, Destroyable } from "../../common";
import { Injector } from "../di";
import { MODULE_AUTH_CONFIG, MODULE_PLUGINS } from "../resolvers";

export class ModuleRef implements Destroyable {

    public instance: any;
    public injector: Injector;

    get auth() {
        return this.injector.get(MODULE_AUTH_CONFIG);
    }

    get plugins() {
        return this.injector.get(MODULE_PLUGINS);
    }

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