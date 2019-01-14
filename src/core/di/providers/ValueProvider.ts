import { BaseProvider } from "./BaseProvider";

export interface ValueProvider<T> extends BaseProvider<T> {
    useValue: T;
}