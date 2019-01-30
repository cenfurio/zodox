import { Type, Destroyable } from "../../common";
import { Injector } from "../di";
import { MODULE_AUTH_CONFIG, MODULE_PLUGINS } from "../resolvers";
import { ModuleSummary } from "../metadata";
import { LifecylceFlag } from "../resolvers/LifecycleResolver";
import { LifecycleService } from "../services/LifecycleService";

export class ModuleRef implements Destroyable {

    public instance: any;
    public injector: Injector;

    get auth() {
        return this.injector.get(MODULE_AUTH_CONFIG);
    }

    get plugins() {
        return this.injector.get(MODULE_PLUGINS);
    }

    private destroyCallbacks: (() => void)[] | null = [];

    constructor(readonly summary: ModuleSummary, parentInjector: Injector) {

        this.injector = Injector.resolveAndCreate([
            ...this.summary.providers,
            this.summary.type.reference,
            {
                provide: ModuleRef,
                useValue: this
            }, 
        ], parentInjector);

        this.instance = this.injector.get(this.summary.type.reference);

        this.injector.get(LifecycleService)!.registerModule(this);
        // if(this.summary.type.lifecycleFlags & LifecylceFlag.OnInit) {
        //     this.instance.onInit();
        // }
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
        console.debug('[ModuleRef]: Destroyed');
    }
}