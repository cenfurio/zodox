import { BaseResolver } from "./BaseResolver";
import { Type, Reflector, NoAnnotationError } from "../../common";
import { Module } from "../annotations";
import { ModuleMetadata } from "../metadata";

// const module = {
//     name: 'MainModule',
//     providers: [{
//         provide: 'UserService'
//     }],
//     imports: [{
//         name: 'AuthModule',
//         providers: [{
//             provide: 'AuthService'
//         }],
//         imports: [{
//             name: 'SubAuthModule',
//             providers: [{
//                 provide: 'SubAuthService'
//             }]
//         }]
//     }]
// };

// console.log(module);

export class ModuleResolver extends BaseResolver {
    private cache = new Map<Type<any>, any>();

    isSupported(type: Type<any>): boolean {
        return Reflector.hasAnnotation(type, Module);
    }
    
    resolve(type: Type<any>): ModuleMetadata {
        if(this.cache.has(type)) {
            return this.cache.get(type)!;
        }

        const annotation = Reflector.getAnnotation(type, Module);
        if(!annotation) {
            throw new NoAnnotationError(type, 'Module');
        }

        //const metadata = new ModuleMetadata(type);
        const metadata: ModuleMetadata = {
            type,
            providers: [],
            declarations: [],
            importedModules: [],
            exportedModules: []
        }

        if(annotation.imports) {
            annotation.imports.forEach(importedModule => {
                if(importedModule == type) {
                    return;
                }

                if(!this.isSupported(importedModule)) {
                    throw new NoAnnotationError(importedModule, 'Module');
                }

                const moduleMeta = this.resolve(importedModule);
                metadata.importedModules.push(moduleMeta);

                //metadata.importedModules = [...metadata.importedModules, ...moduleMeta.importedModules];
                //moduleMeta.importedModules.forEach(type => metadata.importedModules.push(type));

                // TODO: Check whether this module was already included earlier
                //const summary = this.getModuleSummary(importedModule);

                //summary.modules.forEach(mod => metadata.addModule(mod));
                //summary.controllers.forEach(controller => metadata.addController(controller));
                // summary.providers.forEach((providers, modType) => {
                //     // TODO: Do some provider checkin...

                //     providers.forEach(provider => metadata.addProvider(modType, provider));
                // });
                //summary.providers.forEach(provider => metadata.addProvider(provider));
            });
        }

        if(annotation.exports) {
            annotation.exports.forEach(exportedModule => {
                if(!this.isSupported(exportedModule)) {
                    throw new NoAnnotationError(exportedModule, 'Module');
                }

                const moduleMeta = this.resolve(exportedModule);
                metadata.importedModules.push(moduleMeta);
            });
        }

        // if(annotation.controllers) {
        //     annotation.controllers.forEach(controller => {
        //         if(!this.isController(controller)) {
        //             throw new NoAnnotationError(controller, AnnotationDescriptor.CONTROLLER);
        //         }

        //         metadata.addController(controller);
        //     })
        // }

        if(annotation.providers) {
            metadata.providers.push(...annotation.providers);
        }

        //metadata.addModule(type);

        this.cache.set(type, metadata);

        return metadata;
    }
}