export interface Destroyable {
    destroy(): void;
}

/**
 * Check whether given object is an destroyable
 * @param obj The object
 */
export function isDestroyable(obj: any): obj is Destroyable {
    return obj.destroy !== null;
}