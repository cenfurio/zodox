import { Type } from "../../common";
import { InjectionToken } from "../di";
import { TypeMetadata } from "../metadata/TypeMetadata";
import { DeclarationMetadata } from "../metadata/DeclarationMetadata";

export abstract class BaseResolver {

    abstract isSupported(type: Type<any>): boolean;

    abstract resolve(type: Type<any>): DeclarationMetadata;
}