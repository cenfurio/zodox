import { Type } from "@zodox/common";
import { BaseProvider } from "./BaseProvider";

export interface ClassProvider<T> extends BaseProvider<T> {
    useClass: Type<T>
}