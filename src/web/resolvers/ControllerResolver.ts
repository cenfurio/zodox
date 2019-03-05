import { Type, Reflector, NoAnnotationError } from "../../common";
import { Controller, Route, RouteOption } from "../annotations";
import { BaseResolver } from "../../core/resolvers/BaseResolver";
import { ControllerMetadata } from "../metadata/ControllerMetadata";
import { InvalidPathError } from "../errors";

export class ControllerResolver extends BaseResolver {
    private cache = new Map<Type<any>, any>();

    isSupported(type: Type<any>): boolean {
        return Reflector.hasAnnotation(type, Controller);
    }

    resolve(type: Type<any>) {
        if(this.cache.has(type)) {
            return this.cache.get(type)!;
        }

        const annotation = Reflector.getAnnotation(type, Controller);
        if(!annotation) {
            throw new NoAnnotationError(type, 'Controller');
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

        this.cache.set(type, metadata);

        return metadata;
    }
}