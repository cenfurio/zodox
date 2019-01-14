import { BaseProvider } from "./BaseProvider";

export interface FactoryProvider<T> extends BaseProvider<T> {
    useFactory: Function; // TODO: Write interface for function

    deps: any[]; //??
}