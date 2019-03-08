import 'reflect-metadata';

import { Type } from "../lang";

export const ANNOTATIONS = Symbol('annotations');
export const PARAMETERS = Symbol('parameters');
export const PROP_METADATA = Symbol('prop_metadata');

export type PropMetadata = {
    [key: string]: any[]
}

export interface TypeInformation<T> {
    name: string;
    parameters: any[][];
    annotations: any[];
    props: PropMetadata
    factory: (args: any[]) => T;
}

/**
 * A wrapper around reflect-metadata
 * to get information from our decorators
 */
export class Reflector {

    /**
     * Get factory to create given type
     * @param type The type
     */
    static factory<T>(type: Type<T>): (args: any[]) => T {
        return (...args: any[]) => new type(...args);
    }

    /**
     * Get the parent constructor of a type
     * @param type The type
     */
    static parentCtor(type: Type<any>): Type<any> {
        const parentPrototype = type.prototype ? Object.getPrototypeOf(type.prototype) : null;
        
        return parentPrototype ? parentPrototype.constructor : Object;
    }

    /**
     * Get own parameters of the given type
     * @param type The type
     */
    static ownParameters(type: Type<any>): Readonly<any[][]> {
        // TODO: Throw an error when design:paramtypes is undefined,
        // this means the user did not decorate their class with @Injectable
        const paramTypes: any[] = Reflect.getOwnMetadata('design:paramtypes', type) || [];
        const paramAnnotations: any[][] = Reflect.getOwnMetadata(PARAMETERS, type) || [];

        const result: any[][] = new Array(Math.max(paramTypes.length, paramAnnotations.length));

        for (let i = 0; i < result.length; i++) {
            result[i] = [];

            if(paramTypes[i]) {
                result[i] = [...result[i], paramTypes[i]];
            }

            if(paramAnnotations[i]) {
                result[i] = [...result[i], ...paramAnnotations[i]];
            }
        }

        return result;
    }

    /**
     * Get all parameters of the given type
     * @param type The type
     */
    static parameters(type: Type<any>): Readonly<any[][]> {
        const parentCtor = this.parentCtor(type);
        const ownParameters = this.ownParameters(type) || [];
        const parentParameters = parentCtor !== Object ? this.parameters(parentCtor) : [];

        return [...parentParameters, ...ownParameters];
    }

    /**
     * Get own annotations of the given type
     * @param type The type
     */
    static ownAnnotations(type: Type<any>): Readonly<any[]> {
        return Reflect.getOwnMetadata(ANNOTATIONS, type) || [];
    }

    /**
     * Get all annotations of the given type
     * @param type The type
     */
    static annotations(type: Type<any>): Readonly<any[]> {
        const parentCtor = this.parentCtor(type);
        const ownAnnotations = this.ownAnnotations(type);
        const parentAnnotations = parentCtor !== Object ? this.annotations(parentCtor) : [];

        return [...parentAnnotations, ...ownAnnotations];
    }

    /**
     * Get own prop metadata of the given type
     * @param type The type
     */
    static ownPropMetadata(type: Type<any>): Readonly<PropMetadata> {
        return Reflect.getOwnMetadata(PROP_METADATA, type) || {};
    }

    /**
     * Get all prop metadata of the given type
     * @param type The type
     */
    static propMetadata(type: Type<any>): Readonly<PropMetadata> {
        const parentCtor = this.parentCtor(type);
        const ownPropMetadata = this.ownPropMetadata(type);
        const parentPropMetadata = parentCtor !== Object ? this.propMetadata(parentCtor) : null;

        if(!parentPropMetadata) {
            return ownPropMetadata;
        }

        const result: PropMetadata = { ...parentPropMetadata };

        Object.keys(ownPropMetadata).forEach(propKey => {
            const metadata = [];

            if(result.hasOwnProperty(propKey)) {
                metadata.push(...result[propKey]);
            }

            metadata.push(...ownPropMetadata[propKey]);

            result[propKey] = metadata;
        });

        return result;
    }

    static hasMethod(type: Type<any>, method: string) {
        return method in type.prototype;
    }

    /**
     * Checks whether the given type has the given annotation
     * @param type The type
     * @param annotation The annotation
     */
    static hasAnnotation(type: Type<any>, annotation: Type<any>) {
        const annotations = this.annotations(type);

        return annotations.some(a => a instanceof annotation);
    }

    /**
     * Gets an annotation from the given type
     * @param type The type
     * @param annotation The annotation
     */
    static getAnnotation<T>(type: Type<any>, annotation: Type<T>): T | undefined {
        const annotations = this.annotations(type);

        return annotations.find(a => a instanceof annotation);
    }

    /**
     * Gets all known metadata of the given type
     * @param type The type
     */
    static info<T>(type: Type<T>): TypeInformation<T> {
        return {
            name: type.name,
            parameters: this.parameters(type),
            annotations: this.annotations(type),
            props: this.propMetadata(type),
            factory: this.factory(type)
        };
    }
}