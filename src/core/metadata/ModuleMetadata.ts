import { Type } from "../../common";
import { TypeMetadata } from "./TypeMetadata";
import { DeclarationMetadata } from "./DeclarationMetadata";
// import { Provider } from "../di";
// import { TypeMetadata } from "./TypeMetadata";

// export interface ModuleSummary {
//     type: Type<any>;
//     modules: ReadonlyArray<Type<any>>;
//     controllers: ReadonlyArray<Type<any>>;
//     // providers: ReadonlyMap<Type<any>, ReadonlySet<Provider>>;
//     providers: ReadonlyArray<Provider>;
// }

export interface ModuleMetadata extends DeclarationMetadata {
    declarations: DeclarationMetadata[];
    importedModules: ModuleMetadata[];
    exportedModules: ModuleMetadata[];
}

// export class ModuleMetadata implements TypeMetadata {
//     type: Type<any>;
//     private modules = new Set<Type<any>>();
//     //private providers = new Map<Type<any>, Set<Provider>>();
//     private providers = new Set<Provider>();
//     private controllers = new Set<Type<any>>();

//     constructor(type: Type<any>) {
//         this.type = type;
//     }

//     /**
//      * Adds a provider to the given module to this resolved module
//      * @param module The module
//      * @param provider The provider
//      */
//     // addProvider(module: Type<any>, provider: Provider) {
//     //     const providers = this.providers.get(module) || new Set<Provider>();

//     //     if(!providers.has(provider)) {
//     //         providers.add(provider);
//     //     }

//     //     this.providers.set(module, providers);
//     // }
//     addProvider(provider: Provider) {
//         if(!this.providers.has(provider)) {
//             this.providers.add(provider);
//         }
//     }

//     /**
//      * Adds a module type to this resolved module
//      * @param module The module
//      */
//     addModule(module: Type<any>) {
//         if(!this.modules.has(module)) {
//             this.modules.add(module);
//         }
//     }

//     /**
//      * Adds a controller type to this resolved module
//      * @param controller The controller
//      */
//     addController(controller: Type<any>) {
//         if(!this.controllers.has(controller)) {
//             this.controllers.add(controller);
//         }
//     }

//     /**
//      * Get a summary of this module
//      */
//     toSummary(): ModuleSummary {
//         return {
//             type: this.type,
//             modules: Array.from(this.modules.values()),
//             controllers: Array.from(this.controllers.values()),
//             // providers: this.providers
//             providers: Array.from(this.providers.values())
//         }
//     }
// }