import { Type } from "@zodox/common";
import { InjectionToken } from "../di";
import { TypeMetadata } from "../metadata/TypeMetadata";

export const META_RESOLVERS = new InjectionToken<BaseResolver<any>[]>('Metadata Resolvers');

export abstract class BaseResolver<T extends TypeMetadata> {

    abstract isSupported(type: Type<any>): boolean;

    abstract resolve(type: Type<any>): T;
}