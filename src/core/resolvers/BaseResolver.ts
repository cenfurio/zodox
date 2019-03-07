import { Type } from "../../common";
import { InjectionToken } from "../di";
import { TypeMetadata } from "../metadata/TypeMetadata";

export abstract class BaseResolver {

    abstract isSupported(type: Type<any>): boolean;

    abstract resolve(type: Type<any>): TypeMetadata;
}