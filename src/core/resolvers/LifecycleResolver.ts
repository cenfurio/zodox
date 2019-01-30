import { Type, Reflector } from "../../common";

export enum LifecycleHook {
    OnInit = 'onInit',
    OnError = 'onError',
    OnDestroy = 'onDestroy'
}

export enum LifecylceFlag {
    None = 0,
    OnInit = 1 << 0,
    OnError = 1 << 1,
    OnDestroy = 1 << 2
}

/**
 * A lifecycle hook that is called after Zodox has initialized of a provider
 * Define an `onInit()` method to handle any additional initialization tasks.
 */
export interface OnInit {
    /**
     * A callback method that is invoked immediately after the
     * item was initialized for the first time.
     * It is invoked only once when the item is instantiated.
     */
    onInit(): void;
}

export class LifecycleResolver {
    hasLifecylceHook(type: Type<any>, hook: LifecycleHook) {
        return Reflector.hasMethod(type, hook);
    }

    resolveHooks(type: Type<any>) {
        return [LifecycleHook.OnInit, LifecycleHook.OnError, LifecycleHook.OnDestroy]
            .filter(hook => this.hasLifecylceHook(type, hook));
    }

    resolveHooksFlag(type: Type<any>) {
        const hooks = this.resolveHooks(type);
        let flags = LifecylceFlag.None;
        
        hooks.forEach(hook => {
            flags |= this.lifecycleHookToFlag(hook)
        });

        return flags;
    }

    private lifecycleHookToFlag(hook: LifecycleHook) {
        switch(hook) {
            case LifecycleHook.OnInit:
                return LifecylceFlag.OnInit;
            case LifecycleHook.OnError:
                return LifecylceFlag.OnError;
            case LifecycleHook.OnDestroy:
                return LifecylceFlag.OnDestroy;

            default:
                return LifecylceFlag.None;
        }
    }
}