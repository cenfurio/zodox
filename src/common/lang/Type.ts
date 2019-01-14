export interface Type<T> extends Function {
    new (...args: any[]): T;

    //prototype: T
}

// export type Type<T> = Function | { prototype: T };

/**
 * Check whether given object is an type
 * @param obj The object
 */
export function isType<T>(obj: any): obj is Type<T> {
    return typeof obj === 'function';
}