import { Type, Destroyable, asyncForEach } from "../../common";
import { Injector, InjectionToken } from "../di";
import { Inject, Optional } from "../annotations";
import { TypeMetadata } from "../metadata";

export abstract class DeclarationHandler<T extends TypeMetadata> {
    abstract isSupported(declaration: TypeMetadata): boolean;
    abstract handle(declaration: T): Promise<any>;
}

export const MODULE_DECLARATION_HANDLER = new InjectionToken<DeclarationHandler<any>>('Module Declaration Handlers');

export class ModuleDeclarationLoader {
    constructor(
        @Inject(MODULE_DECLARATION_HANDLER)
        @Optional()
        private handlers: DeclarationHandler<any>[] = []) {}

    async handleDeclarations(declarations: TypeMetadata[]) {
        await asyncForEach(declarations, async declaration => {
            await this.handleDeclaration(declaration);
        });
    }
    
    async handleDeclaration(declaration: TypeMetadata) {
        console.log(declaration);
        const supportedHandlers = this.handlers.filter(handler => handler.isSupported(declaration));

        if(supportedHandlers.length == 0) {
            throw new Error(`No declaration handlers found for ${declaration.type.name}`);
        }

        await asyncForEach(supportedHandlers, async handler => {
            await handler.handle(declaration);
        });
    }
}

export class ModuleRef<T> implements Destroyable {
    public readonly injector: Injector;

    get instance(): T {
        return this.injector.get(this.summary.type);
    }

    get declarationLoader(): ModuleDeclarationLoader {
        return this.injector.get(ModuleDeclarationLoader);
    }

    // get auth() {
    //     return this.injector.get(MODULE_AUTH_CONFIG);
    // }

    // get plugins() {
    //     return this.injector.get(MODULE_PLUGINS);
    // }

    private destroyCallbacks: (() => void)[] | null = [];

    constructor(private readonly summary: any, parentInjector: Injector) {

        this.injector = Injector.resolveAndCreate([
            ...this.summary.providers,
            ModuleDeclarationLoader,
            {
                provide: ModuleRef,
                useValue: this
            }, 
        ], parentInjector);

        //this.instance = this.injector.get(this.summary.type);


        //this.injector.get(LifecycleService)!.registerModule(this);
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