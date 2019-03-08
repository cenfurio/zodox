import { Type } from "@zodox/common";
import { Provider } from "../di";

export interface TypeMetadata {
    type: Type<any>;
    providers: Provider<any>[];
    // hooks: any[]; // TODO: Add support for lifecycle hooks
}