import { BaseProvider } from "./BaseProvider";
import { Type } from "../../../common";

export interface ClassProvider<T> extends BaseProvider<T> {
    useClass: Type<T>
}