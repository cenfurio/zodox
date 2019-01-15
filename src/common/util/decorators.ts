import { ANNOTATIONS, PARAMETERS, PROP_METADATA } from "./Reflector";
import { Type } from "../lang";

export interface ClassDecorator<T, R extends any[] = []> {
    (...args: R): (target: Type<any>) => Type<any>;
    new (...args: R): T;
}

export interface ParameterDecorator<T, R extends any[] = []> {
    (...args: R): (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
    new (...args: R): T;
}

export interface PropertyDecorator<T, R extends any[] = []> {
    (...args: R): (target: Object, propertyKey: string | symbol) => void;
    new (...args: R): T;
}

/**
 * Creates a class decorator
 * @param props The props function
 */
export function makeDecorator<T, R extends any[] = []>(
    props?: (...args: R) => T, parent?: ClassDecorator<T, R>): ClassDecorator<T, R> {
  
    const metaCtor = makeMetadataCtor(props);

    function DecoratorFactory(this: any, ...args: any[]) {
        if (this instanceof DecoratorFactory) {
            metaCtor.call(this, ...args);
            return this as any;
        }

        const instance = new (<any>DecoratorFactory)(...args);

        return function TypeDecorator(target: Type<any>) {
            const annotations = Reflect.getOwnMetadata(ANNOTATIONS, target) || [];
            annotations.push(instance);
            Reflect.defineMetadata(ANNOTATIONS, annotations, target);

            return target;
        };
    }

    if(parent) {
        DecoratorFactory.prototype = Object.create(parent.prototype);
    }

    return DecoratorFactory as any;
}

/**
 * Creates a param decorator
 * @param props The props function
 */
export function makeParamDecorator<T, R extends any[] = []>(
    props?: (...args: R) => T, parent?: ParameterDecorator<T, R>): ParameterDecorator<T, R> {

    const metaCtor = makeMetadataCtor(props);

    function ParamDecoratorFactory(this: any, ...args: any[]) {
        if (this instanceof ParamDecoratorFactory) {
            metaCtor.apply(this, args);
            return this as any;
        }

        const instance = new (<any>ParamDecoratorFactory)(...args);

        return function ParamDecorator(target: Object, key: string | symbol, index: number) {
            const parameters: (any[] | null)[] = Reflect.getOwnMetadata(PARAMETERS, target) || [];

            // there might be gaps if some in between parameters do not have annotations.
            // we pad with nulls.
            // while (parameters.length <= index) {
            //     parameters.push(null);
            // }

            parameters[index] = parameters[index] || [];
            parameters[index]!.push(instance);

            Reflect.defineMetadata(PARAMETERS, parameters, target);
        }
    }

    if(parent) {
        ParamDecoratorFactory.prototype = Object.create(parent.prototype);
    }

    return ParamDecoratorFactory as any;
}

/**
 * Creates a prop decorator
 * @param props The props function
 */
export function makePropDecorator<T, R extends any[] = []>(
    props?: (...args: R) => T, parent?: PropertyDecorator<any, any>): PropertyDecorator<T, R> {
    
    const metaCtor = makeMetadataCtor(props);

    function PropDecoratorFactory(this: any, ...args: any[]): any {
        if (this instanceof PropDecoratorFactory) {
            metaCtor.apply(this, args);
            return this;
        }

        const instance = new (<any>PropDecoratorFactory)(...args);

        return function PropDecorator(target: Object, key: symbol | string) {
            const props = Reflect.getOwnMetadata(PROP_METADATA, target.constructor) || {};

            props[key] = props.hasOwnProperty(key) && props[key] || [];
            props[key].unshift(instance);

            Reflect.defineMetadata(PROP_METADATA, props, target.constructor);
        };
    }

    if(parent) {
        PropDecoratorFactory.prototype = Object.create(parent.prototype);
    }

    return PropDecoratorFactory as any;
}

function makeMetadataCtor(props?: (...args: any) => any): any {
    return function ctor(this: any, ...args: any) {
        if (props) {
            const values = props(...args);
            for (const propName in values) {
                this[propName] = values[propName];
            }
        }
    };
}