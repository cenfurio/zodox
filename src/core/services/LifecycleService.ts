import { ModuleRef } from "../refs";
import { LifecylceFlag } from "../resolvers/LifecycleResolver";
import { Injectable } from "../annotations";
import { removeItem } from "../../common";

@Injectable()
export class LifecycleService {
    private modules: ModuleRef[] = [];

    registerModule(ref: ModuleRef) {
        // TODO: Only do this if module was not initialized yet...
        const { lifecycleFlags } = ref.summary.type;
        if(lifecycleFlags & LifecylceFlag.OnInit) {
            ref.instance.onInit();
        }

        ref.onDestroy(() => {
            if(lifecycleFlags & LifecylceFlag.OnDestroy) {
                ref.instance.onDestroy();
            }
            
            removeItem(this.modules, ref);
        })

        this.modules.push(ref);
    }

    callModuleLifecycle(ref: ModuleRef, flags: LifecylceFlag) {
        if(flags & LifecylceFlag.OnInit) {
            ref.instance.onInit();
        }

        if(flags & LifecylceFlag.OnDestroy) {
            ref.instance.onDestroy();
        }
    }
}