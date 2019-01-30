import { Type } from "../../common";
import { LifecylceFlag } from "../resolvers/LifecycleResolver";

export interface TypeMetadata {
    reference: Type<any>
    lifecycleFlags: LifecylceFlag
}