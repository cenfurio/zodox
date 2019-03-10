import { BaseResolver, TypeMetadata, NoAnnotationError } from "@zodox/core";
import { Type, Reflector } from "@zodox/common";
import { Middleware } from "../annotations/middleware";

export class MiddlewareResolver extends BaseResolver<any> {
    private cache = new Map<Type<any>, TypeMetadata>();

    isSupported(type: Type<any>): boolean {
        return Reflector.hasAnnotation(type, Middleware);
    }

    resolve(type: Type<any>): any {
        if(this.cache.has(type)) {
            return this.cache.get(type)!;
        }

        const annotation = Reflector.getAnnotation(type, Middleware);
        if(!annotation) {
            throw new NoAnnotationError(type, 'Middleware');
        }


    }
}