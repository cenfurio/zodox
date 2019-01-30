import { Type, Reflector, NoAnnotationError, AnnotationDescriptor, InvalidPathError,  } from "../../common";

import { ModuleMetadata, ControllerMetadata, ModuleSummary, ControllerSummary, TypeMetadata } from "../metadata";
import { Injectable, Module, Controller, Route, RouteOption, ModuleAuth } from '../annotations';
import { InjectionToken } from "../di";
import { ServerRegisterPluginObject } from "hapi";
import { LifecycleResolver } from "./LifecycleResolver";

// FIXME: Remove the need of these
// @internal
export const MODULE_AUTH_CONFIG = new InjectionToken<ModuleAuth>('module auth');
export const MODULE_PLUGINS = new InjectionToken<ServerRegisterPluginObject<any>[]>('module plugins');

@Injectable()
export class MetadataResolver {

    constructor(private lifecycleResolver: LifecycleResolver) {}

    private typeCache = new Map<Type<any>, TypeMetadata>();
    private moduleCache = new Map<Type<any>, ModuleMetadata>();
    private controllerCache = new Map<Type<any>, ControllerMetadata>();

    /**
     * Clears the cache of this resolver
     */
    clearCache() {
        this.typeCache.clear();
        this.moduleCache.clear();
        this.controllerCache.clear();
    }

    /**
     * Checks whether the given type is a module
     * @param type The module type
     */
    isModule(type: Type<any>) {
        return Reflector.hasAnnotation(type, Module);
    }

    /**
     * Checks whether the given type is a controller
     * @param type The controller type
     */
    isController(type: Type<any>) {
        return Reflector.hasAnnotation(type, Controller);
    }

    /**
     * Gets the {@link ModuleSummary} of the module
     * @param type The module type
     * @throws NoAnnotationError
     */
    getModuleSummary(type: Type<any>): ModuleSummary {
        if(this.moduleCache.has(type)) {
            return this.moduleCache.get(type)!.toSummary();
        }

        const metadata = this.resolveModuleMetadata(type);
        
        return metadata.toSummary();
    }

    /**
     * Gets the {@link ControllerSummary} of the controller
     * @param type The controller type
     * @throws NoAnnotationError
     */
    getControllerSummary(type: Type<any>): ControllerSummary {
        if(this.controllerCache.has(type)) {
            return this.controllerCache.get(type)!.toSummary();
        }

        const metadata = this.resolveControllerMetadata(type);

        return metadata.toSummary();
    }

    /**
     * Resolves given type into {@link ModuleMetadata}
     * @param type The module type
     * @throws NoAnnotationError
     */
    resolveModuleMetadata(type: Type<any>): ModuleMetadata {
        if(this.moduleCache.has(type)) {
            return this.moduleCache.get(type)!;
        }

        const annotation = Reflector.getAnnotation(type, Module);

        if(!annotation) {
            throw new NoAnnotationError(type, AnnotationDescriptor.MODULE);
        }

        const metadata = new ModuleMetadata(this.resolveTypeMetadata(type));

        if(annotation.imports) {
            annotation.imports.forEach(importedModule => {
                if(importedModule == type) {
                    return;
                }

                if(!this.isModule(importedModule)) {
                    throw new NoAnnotationError(importedModule, AnnotationDescriptor.MODULE);
                }

                // TODO: Check whether this module was already included earlier
                const summary = this.getModuleSummary(importedModule);

                summary.modules.forEach(mod => metadata.addModule(mod));
                summary.controllers.forEach(controller => metadata.addController(controller));
                // summary.providers.forEach((providers, modType) => {
                //     // TODO: Do some provider checkin...

                //     providers.forEach(provider => metadata.addProvider(modType, provider));
                // });
                summary.providers.forEach(provider => metadata.addProvider(provider));
            });
        }

        if(annotation.controllers) {
            annotation.controllers.forEach(controller => {
                if(!this.isController(controller)) {
                    throw new NoAnnotationError(controller, AnnotationDescriptor.CONTROLLER);
                }

                metadata.addController(controller);
            })
        }

        // TODO: Only allow this in the MainModule
        if(annotation.auth) {
            metadata.addProvider({
                provide: MODULE_AUTH_CONFIG,
                useValue: annotation.auth
            });
        }

        // TODO: Only allow this in the MainModule
        if(annotation.plugins) {
            metadata.addProvider({
                provide: MODULE_PLUGINS,
                useValue: annotation.plugins
            });
        }

        if(annotation.providers) {
            annotation.providers.forEach(provider => metadata.addProvider(provider));
        }

        // TODO: Handle plugins

        metadata.addModule(type);

        this.moduleCache.set(type, metadata);

        return metadata;
    }

    /**
     * Resolves given type into {@link ControllerMetadata}
     * @param type The controller type
     * @throws NoAnnotationError
     */
    resolveControllerMetadata(type: Type<any>): ControllerMetadata {
        if(this.controllerCache.has(type)) {
            return this.controllerCache.get(type)!;
        }

        const annotation = Reflector.getAnnotation(type, Controller);
        if(!annotation) {
            throw new NoAnnotationError(type, AnnotationDescriptor.CONTROLLER);
        }

        const metadata = new ControllerMetadata(type);

        if(annotation.providers) {
            annotation.providers.forEach(provider => metadata.addProvider(provider));
        }

        const propAnnotations = Reflector.propMetadata(type);
        
        Object.keys(propAnnotations).forEach(propKey => {
            propAnnotations[propKey].forEach(propAnnotation => {
                if(propAnnotation instanceof Route) {
                    if(!propAnnotation.path.startsWith('/')) {
                        throw new InvalidPathError(propAnnotation.path);
                    }

                    if(propAnnotation.path.length === 1) { // AKA, only a /
                        propAnnotation.path = '';
                    }

                    metadata.addRoute(propKey, {
                        ...propAnnotation,
                        path: annotation.path + propAnnotation.path
                    })
                }

                if(propAnnotation instanceof RouteOption) {
                    metadata.addRouteOptions(propKey, { ...propAnnotation });
                }
            })
        });

        this.controllerCache.set(type, metadata);

        return metadata;
    }

    resolveTypeMetadata(type: Type<any>): TypeMetadata {
        if(this.typeCache.has(type)) {
            return this.typeCache.get(type)!;
        }

        const metadata: TypeMetadata = {
            reference: type,
            lifecycleFlags: this.lifecycleResolver.resolveHooksFlag(type)
        }

        this.typeCache.set(type, metadata);

        return metadata;
    }
}